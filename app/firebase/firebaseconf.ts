import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// If you had config values in the removed `src/firebaseConfig.ts`, they are
// embedded here as the default `firebaseConfigFromFile`. Otherwise we fall
// back to environment variables.
const firebaseConfigFromFile = {
  apiKey: "AIzaSyCHapsoVKSnQJlynX1xBgiGQmMtAY6Zdo4",
  authDomain: "healai-b9bfb.firebaseapp.com",
  projectId: "healai-b9bfb",
  storageBucket: "healai-b9bfb.firebasestorage.app",
  messagingSenderId: "915874161016",
  appId: "1:915874161016:web:d9937dd480c02679a7a88d",
  measurementId: "G-T9EEWJW2Y9",
};

// Prefer explicit config values from embedded defaults, otherwise environment.
const firebaseConfig = {
  apiKey: firebaseConfigFromFile?.apiKey ?? process.env.FIREBASE_API_KEY ?? '',
  authDomain: firebaseConfigFromFile?.authDomain ?? process.env.FIREBASE_AUTH_DOMAIN ?? '',
  projectId: firebaseConfigFromFile?.projectId ?? process.env.FIREBASE_PROJECT_ID ?? '',
  storageBucket: firebaseConfigFromFile?.storageBucket ?? process.env.FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: firebaseConfigFromFile?.messagingSenderId ?? process.env.FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: firebaseConfigFromFile?.appId ?? process.env.FIREBASE_APP_ID ?? '',
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.appId && firebaseConfig.projectId
);

let app: ReturnType<typeof initializeApp> | null = null;
if (isFirebaseConfigured) {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
} else {
  // Keep exports defined so importing modules won't throw in Expo Go.
  app = null;
  console.warn(
    'Firebase is not configured. Set FIREBASE_API_KEY, FIREBASE_APP_ID, and FIREBASE_PROJECT_ID to enable Firebase functionality.'
  );
}

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;

export default { app, auth, db, isFirebaseConfigured };
