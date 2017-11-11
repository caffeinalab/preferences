'use strict'

function Preferences (id, defs, options) {
  options = options || {
    key: null,
    file: null,
    encrypt: true,
    format: 'json'
  }
  var self = this
  var identifier = id.replace(/[\/\?<>\\:\*\|" :]/g, '.').replace(/\.+/g, '.')
  var path = require('path')
  var homedir = require('os-homedir')()
  var dirpath =  options.file ? path.dirname(options.file) : path.join(homedir, '.config', 'preferences')
  var filepath = options.file ? path.join(dirpath, path.basename(options.file)) : path.join(dirpath, identifier + '.pref')
  var encrypt = options.encrypt;
  var format = options.format;
  var fs = require('graceful-fs')
  var writeFileAtomic = require('write-file-atomic')
  var mkdirp = require('mkdirp')
  var crypto = require('crypto')
  var yaml = require('js-yaml')
  var password = (function () {
    var key = options.key || path.join(homedir, '.ssh', 'id_rsa')
    try {
      // Use private SSH key or...
      return fs.readFileSync(key).toString('utf8')
    } catch (e) {
      // ...fallback to an id dependant password
      return 'PREFS-' + identifier
    }
  })()
  var savePristine = false
  var savedData = null

  function encode (text) {
    if (!encrypt) return text;
    var cipher = crypto.createCipher('aes128', password)
    return cipher.update(new Buffer(text).toString('utf8'), 'utf8', 'hex') + cipher.final('hex')
  }

  function decode (text) {
    if (!encrypt) return text;
    var decipher = crypto.createDecipher('aes128', password)
    return decipher.update(String(text), 'hex', 'utf8') + decipher.final('utf8')
  }

  function serialize (data) {
    if (format == 'yaml') return yaml.safeDump(data)
    return JSON.stringify(data)
  }

  function deserialize (text) {
    if (format == 'yaml') return yaml.safeLoad(text)
    return JSON.parse(text)
  }

  function save () {
    var payload = encode(String(serialize(self) || '{}'))
    try {
      mkdirp.sync(dirpath, parseInt('0700', 8))
      writeFileAtomic.sync(filepath, payload, {
        mode: parseInt('0600', 8)
      })
    } catch (err) {}
  }

  function clear () {
    for (var o in self) delete self[o]
    save()
  }

  if (Object.defineProperty) {
    Object.defineProperty(self, "save", {
      enumerable: false,
      writable: false,
      value: save
    });

    Object.defineProperty(self, "clear", {
      enumerable: false,
      writable: false,
      value: clear
    });
  }

  try {
    // Try to read and decode preferences saved on disc
    savedData = deserialize(decode(fs.readFileSync(filepath, 'utf8')))
  } catch (err) {
    // Read error (maybe file doesn't exist) so update with defaults
    savedData = defs || {}
    savePristine = true
  }

  // Clone object
  for (var o in savedData) self[o] = savedData[o]

  // Config file was empty, save default values
  savePristine && save()

  // Save all on program exit
  process.on('exit', save)

  // If supported observe object for saving on modify
  if (Object.observe) Object.observe(self, save)

  return self
}

module.exports = Preferences
