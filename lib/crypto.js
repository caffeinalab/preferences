const crypto = require('crypto')

const algorithm = 'aes-256-ctr'
const inputEncoding = 'utf8'
const outputEncoding = 'hex'

function encode (text, key) {
  const iv = crypto.randomBytes(8).toString('hex')
  const cipher = crypto.createCipheriv(algorithm, key, iv)
  const crypted = cipher.update(text, inputEncoding, outputEncoding) + cipher.final(outputEncoding)
  return `${iv.toString('hex')}:${crypted.toString()}`
}

function decode (text, key) {
  const [ivstring, encrypted] = text.split(':')
  const decipher = crypto.createDecipheriv(algorithm, key, ivstring)
  return decipher.update(encrypted, outputEncoding, inputEncoding) + decipher.final(inputEncoding)
}

function legacyDecode (text, password) {
  const decipher = crypto.createDecipher('aes128', password)
  return decipher.update(String(text), outputEncoding, inputEncoding) + decipher.final(inputEncoding)
}

module.exports = {
  encode,
  decode,
  legacyDecode,
};
