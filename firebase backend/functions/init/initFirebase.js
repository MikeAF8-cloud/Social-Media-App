const firebase = require('firebase');

// Retrieve app confiuration
const { config } = require('../utils/config');

// Initialize Firebase
module.exports.firebaseApp = firebase.initializeApp(config);
module.exports.firebase = firebase;