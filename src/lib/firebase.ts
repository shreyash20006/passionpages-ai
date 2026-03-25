import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GithubAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAlU3et850ae8Y4IE5qxz8A5qImqZQIzZk",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "passionpagesai-cf962.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "passionpagesai-cf962",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "passionpagesai-cf962.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "944678664399",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:944678664399:web:dbdbe230fea3b1c1371fba",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-HC0M5RB43H"
};

export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const githubProvider = new GithubAuthProvider();
