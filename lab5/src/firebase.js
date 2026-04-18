import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSy" + "Anx2hQ2hfsP9cUUAdVUh52ytQ2OC3Z4mg",
    authDomain: "jobfinder-769fe.firebaseapp.com",
    projectId: "jobfinder-769fe",
    storageBucket: "jobfinder-769fe.firebasestorage.app",
    messagingSenderId: "31615748288",
    appId: "1:31615748288:web:0c7da2416f686ae65f8525"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);