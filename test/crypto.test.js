const { encode, decode }  = require('../lib/crypto')
const { describe, it, expect } = require('../lib/testrunner')
const fs = require('fs');
const path = require('path')
const os = require('os')
const crypto = require('crypto');
const homedir = os.homedir()

let key = '';

try {
  const file = path.join(homedir, '.ssh', 'id_rsa')
  key = fs.readFileSync(file).toString('utf8').slice(0, 32)
} catch (e) {
  key = crypto.randomBytes(32);
}

describe('Crypto module', () => {
  it('can encrypt and decrypt a message', () => {
    const text = 'This is a secret message.';
    
    const enc = encode(text, key);
    const decoded = decode(enc, key);
    
    expect(text).toBe(decoded)
  })
})
