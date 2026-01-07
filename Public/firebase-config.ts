
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDO9RoLM6ZtJXiwNIG0c9soZEsSDOUh6pc",
    authDomain: "global-98f25.firebaseapp.com",
    databaseURL: "https://global-98f25-default-rtdb.firebaseio.com",
    projectId: "global-98f25",
    storageBucket: "global-98f25.firebasestorage.app",
    messagingSenderId: "18868844294",
    appId: "1:18868844294:web:416125c6e19f1f5dcc9087"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();
export const googleProvider = new firebase.auth.GoogleAuthProvider();

export default firebase;
