import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Fill these values from your Firebase console or set them via environment variables.
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY ?? '',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN ?? '',
  projectId: process.env.FIREBASE_PROJECT_ID ?? '',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: process.env.FIREBASE_APP_ID ?? '',
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.appId && firebaseConfig.projectId);

let auth: ReturnType<typeof getAuth> | null = null;

if (isFirebaseConfigured) {
  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }
  auth = getAuth();
} else {
  console.warn('Firebase is not configured. Set FIREBASE_API_KEY, FIREBASE_APP_ID, and FIREBASE_PROJECT_ID to enable auth.');
}

export { auth };
