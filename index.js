"use strict";

var Configstore = require('configstore');

function Preferences(id, default){
	this.store = new Configstore(id, default||{});
}

module.exports = Preferences;
