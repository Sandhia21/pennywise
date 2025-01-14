import { initializeApp } from "firebase/app";
import {getFirestore} from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBpeIbccBuDMfnQ35dA_1D0TuJo2F1g2-M",
  authDomain: "flutter-project-47cdc.firebaseapp.com",
  projectId: "flutter-project-47cdc",
  storageBucket: "flutter-project-47cdc.appspot.com",
  messagingSenderId: "795887423895",
  appId: "1:795887423895:web:288b46a2c6715dd17b74d2"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore};