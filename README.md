# Preferences

![NPM version](https://img.shields.io/npm/dm/preferences.svg)
![NPM downloads](https://img.shields.io/npm/dt/preferences.svg)

Node.JS Module for handling local user preferences.

Designed for CLI applications.

## Installation

```sh
npm install --save preferences
```

## Usage

```js
var Preferences = require("preferences");
// Init preference file with an unique identifier and an optional default data
var prefs = new Preferences('com.your.app.identifier',{
  account: {
    username: 'MrRobot',
    password: 'fsociety'
  },
	test: {
		cycles: 1
  }
});

// Preferences can be accessed directly
prefs.test.cycles++;

console.log(prefs.account);
```

Preferences are automatically saved on disk before process exit.

## License

MIT
