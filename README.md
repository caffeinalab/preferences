# Preferences

![NPM version](https://img.shields.io/npm/dm/preferences.svg)
![NPM downloads](https://img.shields.io/npm/dt/preferences.svg)

Node.JS Module for handling **encrypted** user preferences.

Designed for CLI applications.

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

## Installation

[![NPM](https://nodei.co/npm/preferences.png)](https://npmjs.org/package/preferences)

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

console.log(prefs);
```

Preferences are automatically saved on disk before process exit.

## Options
### Encryption
Encryption uses your private ssh key if founded, otherwise it will automatically use an identifier dependant generated password.

You can override the default key path in the options:

```js
var prefs = new Preferences('com.foo.bar',{}, {
  key: '~/certs/my-custom-key.pem'
});
```

You can disable encryption for plain text preferences by setting encrypt to false.
```js
var prefs = new Preferences('com.foo.bar',{}, {
  encrypt: false
});
```

### Location
The preference file defaults to being saved in ~/.config/preferences/IDENTIFIER.pref. For example, the following would create ```~/.config/preferences/com.foo.bar.pref```.

```js
var prefs = new Preferences('com.foo.bar');
```

### Human Editable
You can use the format option to specify the format for serialization. The supported types are ```json``` and ```yaml```. This option is most useful when disabling encryption as it provides a human editable file.

```js
var prefs = new Preferences('com.foo.bar',{}, {
  encrypt: false,
  file: path.join(path.dirname(process.cwd()), '.foo'),
  format: 'yaml'
});
```

## License

MIT. Copyright (c) 2015 Caffeina.
