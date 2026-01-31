// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate required Firebase config (API key must be set and non-empty)
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
  console.error(
    'Firebase: Missing or invalid VITE_FIREBASE_API_KEY. ' +
    'Create a .env file in the frontend folder with your Firebase config. ' +
    'See .env.example for required variables.'
  );
  throw new Error(
    'Firebase config is missing. Add VITE_FIREBASE_API_KEY (and other VITE_FIREBASE_* vars) to frontend/.env. ' +
    'Get these from Firebase Console → Project Settings → Your apps.'
  );
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize Analytics (optional)
if (typeof window !== 'undefined') {
  getAnalytics(app);
}

export const fetchWithAuth = async (url, options) => {
    const token = await auth.currentUser?.getIdToken();
    if (!token) {
        throw new Error("No authenticated user");
    }
    return fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`
        }
    });
}