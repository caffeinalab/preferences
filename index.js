'use strict'
const os = require('os');
const path = require('path')

const { encode, decode, legacyDecode } = require('./lib/crypto')
const padText = require('./lib/toThirtytwo');
const fs = require('fs')
const yaml = require('yaml')

const defaultOptions =  {
  key: null,
  file: null,
  encrypt: true,
  format: 'json',
}

function Preferences (id, defs, options = defaultOptions) {
  const homedir = os.homedir()
  // eslint-disable-next-line no-useless-escape
  const identifier = id.replace(/[\/\?<>\\:\*\|" :]/g, '.').replace(/\.+/g, '.')
  const dirpath =  options.file ? path.dirname(options.file) : path.join(homedir, '.config', 'preferences')
  const filepath = options.file ? path.join(dirpath, path.basename(options.file)) : path.join(dirpath, identifier + '.pref')
  const { encrypt, format } = options

  let savePristine = false
  let savedData = null
  let convertFromLegacy = false

  const key = (function () {
    let key;
    if (options.key) key = padText(options.key, identifier)
    else key = path.join(homedir, '.ssh', 'id_rsa')
    try {
      // Use private SSH key or...
      return fs.readFileSync(key).toString('utf8').slice(0, 32)
    } catch (e) {
      // ...fallback to an id dependant password
      return padText('PREFS', identifier)
    }
  })()

  // retaining old code in order to be able to decode exisiting preferences
  const legacyPassword = (function () {
    const key = options.key || path.join(homedir, '.ssh', 'id_rsa')
    try {
      // Use private SSH key or...
      return fs.readFileSync(key).toString('utf8')
    } catch (e) {
      // ...fallback to an id dependant password
      return 'PREFS-' + identifier
    }
  })()

  const serialize = (data) => {
    return format == 'yaml' 
      ? yaml.stringify(data)
      : JSON.stringify(data)
  };

  const deserialize = (text) => {
    return format == 'yaml' 
      ? yaml.parse(text)
      : JSON.parse(text)
  };

  const save = () => {
    let payload = String(serialize(this) || '{}')
    if (encrypt) payload = encode(payload, key);
    try {
      fs.mkdirSync(dirpath, { recursive: true, mode: parseInt('0700', 8) })
      fs.writeFileSync(filepath, payload, { mode: parseInt('0600', 8) })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
    }
  }

  const clear = () => {
    for (let o in this) delete this[o]
    save()
  }

  if (Object.defineProperty) {
    Object.defineProperty(this, 'save', {
      enumerable: false,
      writable: false,
      value: save,
    });

    Object.defineProperty(this, 'clear', {
      enumerable: false,
      writable: false,
      value: clear,
    });
  }

  // Try to read and decode preferences saved on disc
  let fileContents = '';
  try {
    fileContents = fs.readFileSync(filepath, 'utf8')
  } 
  catch (err) {
    // Read error (maybe file doesn't exist) so update with defaults
    savedData = defs || {}
    savePristine = true
  }
  if (fileContents) {
    let results = fileContents
    if (encrypt) {
      try {
        results = decode(fileContents, key)
      }
      catch (e) {
        results = legacyDecode(fileContents, legacyPassword)
        convertFromLegacy = true;
      }
    }
    savedData = deserialize(results)
  }
  
  // Clone object
  for (let o in savedData) this[o] = savedData[o]

  // Config file was empty, save default values
  savePristine || convertFromLegacy && save()

  // Save all on program exit
  process.on('exit', save)

  // If supported observe object for saving on modify
  if (Object.observe) Object.observe(this, save)

  return this
}

module.exports = Preferences
