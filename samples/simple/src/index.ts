import Preferences = require('preferences')

// Init preference file with an unique identifier and an optional default data
let prefs = new Preferences('com.your.app.identifier', {
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