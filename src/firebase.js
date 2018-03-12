import * as firebase from 'firebase';

require('firebase/firestore');

let db;
let auth;

const config = {
  apiKey: "AIzaSyCW6kfjs9FDy9kqJNQY5jLp8pYI-H4E_60",
  authDomain: "dordoifashion-94bf2.firebaseapp.com",
  databaseURL: "https://dordoifashion-94bf2.firebaseio.com",
  projectId: "dordoifashion-94bf2",
  storageBucket: "dordoifashion-94bf2.appspot.com",
  messagingSenderId: "468133626755"
};

firebase.initializeApp(config)
db = firebase.firestore;
auth = firebase.auth;
export {
  db,
  auth
}
