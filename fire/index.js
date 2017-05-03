const firebase = require('firebase')

// -- // -- // -- // Firebase Config // -- // -- // -- //
// Environment keys are in the '.stackquest.env.json' file in home folder
const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: 'stackquest-b5399.firebaseapp.com',
  databaseURL: 'https://stackquest-b5399.firebaseio.com',
  projectId: 'stackquest-b5399',
  storageBucket: 'stackquest-b5399.appspot.com',
  messagingSenderId: process.env.MESSAGING_SENDER_ID
}
// -- // -- // -- // -- // -- // -- // -- // -- // -- //

// Initialize the app, but make sure to do it only once.
//   (We need this for the tests. The test runner busts the require
//   cache when in watch mode; this will cause us to evaluate this
//   file multiple times. Without this protection, we would try to
//   initialize the app again, which causes Firebase to throw.
//
//   This is why global state makes a sad panda.)
firebase.__bonesApp || (firebase.__bonesApp = firebase.initializeApp(config))

module.exports = firebase
