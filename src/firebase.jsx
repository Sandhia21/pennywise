import { initializeApp } from "firebase/app";
import {getFirestore} from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBx3oUGTANT6MFzXejC0SmukKsVmM6D8OE",
  authDomain: "pennywise-4242e.firebaseapp.com",
  projectId: "pennywise-4242e",
  storageBucket: "pennywise-4242e.firebasestorage.app",
  messagingSenderId: "725451788482",
  appId: "1:725451788482:web:175b0b2cc1fc9d9c88eb5b"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore};