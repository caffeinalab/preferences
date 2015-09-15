"use strict";

function Preferences(id, def_prefs){

	var self							= this,
			path							= require('path'),
			dirpath						= path.join(require('os').homedir(), '.config', 'preferences'),
			filepath					= path.join(dirpath,id + '.pref'),
			savedData					= null,
			fs 								= require('graceful-fs'),
			mkdirp 						= require('mkdirp'),
			writeFileAtomic 	= require('write-file-atomic'),
			crypto    				= require("crypto"),
			cipher    				= crypto.createCipher("aes192", 'PREFS-' + id),
			decipher  				= crypto.createDecipher("aes192", 'PREFS-' + id),
			savePristine      = false;

	function save() {
		var payload = '';
		try {
		  payload = cipher.update(JSON.stringify(self)||'{}', "utf8", "hex") + cipher.final('hex');
			mkdirp.sync(dirpath, parseInt('0700', 8));
			writeFileAtomic.sync(filepath, payload, {mode: parseInt('0600', 8)});
		} catch(err) {}
	};

	try {
		savedData = JSON.parse(decipher.update(fs.readFileSync(filepath, 'utf8'), "hex", "utf8") + decipher.final('utf8'));
	} catch (err) {
		savedData = def_prefs || {};
		savePristine = true;
	}

	for (var o in savedData) this[o] = savedData[o];

	//Object.observe(this, save);

	savePristine && save();

	process.on('exit',save);

	return this;
}

module.exports = Preferences;
