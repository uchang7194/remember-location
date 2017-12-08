import firebase from 'firebase';

var config = {
  apiKey: "AIzaSyAzBoewv7Xby9mHMcGFEL2OqgO1hKFfBnI",
  authDomain: "remember-locatio-1512108016282.firebaseapp.com",
  databaseURL: "https://remember-locatio-1512108016282.firebaseio.com",
  projectId: "remember-locatio-1512108016282",
  storageBucket: "",
  messagingSenderId: "439989075391"
};

firebase.initializeApp(config);

export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const database = firebase.database();
export const storage = firebase.storage();
export const auth = firebase.auth();
