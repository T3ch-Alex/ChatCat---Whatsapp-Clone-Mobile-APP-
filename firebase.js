
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

//Get auth and storage methods from firebase
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getStorage } from 'firebase/storage'
import { initializeFirestore } from 'firebase/firestore'

//All firebase config data
const firebaseConfig = {
  apiKey: "AIzaSyANZ-qVbIsQoFyTY3E5sJWsQs99z9bxTVk",
  authDomain: "chatcat-db2d8.firebaseapp.com",
  projectId: "chatcat-db2d8",
  storageBucket: "chatcat-db2d8.appspot.com",
  messagingSenderId: "547116908315",
  appId: "1:547116908315:web:97db4058abc44572e65dbe",
  measurementId: "G-ZYBH0BCZPV"
};

//Export app, auth and storage functions
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = initializeFirestore(app, {experimentalForceLongPolling: true});

export function signIn(email, password){
  return signInWithEmailAndPassword(auth, email, password)
}

export function signUp(email, password){
  return createUserWithEmailAndPassword(auth, email, password)
}

const analytics = getAnalytics(app);