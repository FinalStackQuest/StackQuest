const firebase = require('firebase')

// -- // -- // -- // Firebase Config // -- // -- // -- //
const config = {
  apiKey: "AIzaSyAA3BGumGYqFILRzyv-vye-lZ-AhneyYqU",
  authDomain: "stackquest-b5399.firebaseapp.com",
  databaseURL: "https://stackquest-b5399.firebaseio.com",
  projectId: "stackquest-b5399",
  storageBucket: "stackquest-b5399.appspot.com",
  messagingSenderId: "873444861073"
};
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
