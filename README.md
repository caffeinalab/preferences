# Preferences

![NPM version](https://img.shields.io/npm/dm/preferences.svg)
![NPM downloads](https://img.shields.io/npm/dt/preferences.svg)

Node.JS Module for handling **encrypted** user preferences.

Designed for CLI applications.

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

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

Encryption uses your private ssh key if founded, otherwise it will automatically use an identifier dependant generated password.

You can override the default key path in the options:

```js
var prefs = new Preferences('com.foo.bar',{}, {
  key: '~/certs/my-custom-key.pem'
});
```

## License

MIT. Copyright (c) 2015 Caffeina.
