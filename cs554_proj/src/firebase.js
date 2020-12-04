import "firebase/auth";
import firebase from "firebase/app";
//this stuff should be environment variables in production, since this is obviouisly insecure
//Don't really care in the context of this project tho
const firebaseConfig = {
    apiKey: "AIzaSyD5ZTkBxReq1gHWg1TYoaIGO6oHGaAR6Ak",
    authDomain: "cs554finalproj.firebaseapp.com",
    databaseURL: "https://cs554finalproj.firebaseio.com",
    projectId: "cs554finalproj",
    storageBucket: "cs554finalproj.appspot.com",
    messagingSenderId: "568173716710",
    appId: "1:568173716710:web:63a05733b09f2ad1838727"
  };

export const fb = firebase.initializeApp(firebaseConfig)
