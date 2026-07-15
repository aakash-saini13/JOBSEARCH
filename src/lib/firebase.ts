import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "hopeful-mesh-2f4nj",
  appId: "1:970399729814:web:b7f1d4ebbed1588c565ab7",
  apiKey: "AIzaSyBSyO8_qZ_kky6XUiDVsDbh06zsz1_KRXs",
  authDomain: "hopeful-mesh-2f4nj.firebaseapp.com",
  storageBucket: "hopeful-mesh-2f4nj.firebasestorage.app",
  messagingSenderId: "970399729814",
  measurementId: ""
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-80e437c4-a487-40da-9afc-de7d15fb9588");
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/gmail.send');
export let cachedAccessToken: string | null = null;
export const setCachedAccessToken = (token: string | null) => { cachedAccessToken = token; };
