import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA45XxfgRdVfop8QhdWarU0rZek9N6wWqI",
  authDomain: "food-2-847b2.firebaseapp.com",
  databaseURL: "https://food-2-847b2-default-rtdb.firebaseio.com",
  projectId: "food-2-847b2",
  storageBucket: "food-2-847b2.firebasestorage.app",
  messagingSenderId: "957856678477",
  appId: "1:957856678477:web:fc751e9afe08769466d204"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
