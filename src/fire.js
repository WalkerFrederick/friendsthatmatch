import firebase from 'firebase'
var config = {
  apiKey: "AIzaSyBfrgvgnEhElHJVd5X8dHUlrP2b9Dr_eO4",
  authDomain: "friendsthatmatch.firebaseapp.com",
  databaseURL: "https://friendsthatmatch.firebaseio.com",
  projectId: "friendsthatmatch",
  storageBucket: "",
  messagingSenderId: "1018559950221",
  appId: "1:1018559950221:web:b88f109498c5d948"
};
var fire = firebase.initializeApp(config);
export default fire;