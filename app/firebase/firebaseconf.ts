import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfigFromFile = {
  apiKey: "AIzaSyCHapsoVKSnQJlynX1xBgiGQmMtAY6Zdo4",
  authDomain: "healai-b9bfb.firebaseapp.com",
  projectId: "healai-b9bfb",
  storageBucket: "healai-b9bfb.firebasestorage.app",
  messagingSenderId: "915874161016",
  appId: "1:915874161016:web:d9937dd480c02679a7a88d",
  measurementId: "G-T9EEWJW2Y9",
};

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
let auth: ReturnType<typeof getAuth> | null = null;
let db: ReturnType<typeof getFirestore> | null = null;

if (isFirebaseConfigured) {
  try {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    
    auth = getAuth(app);
    db = getFirestore(app);
    
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.error('Firebase initialization error:', error);
    app = null;
    auth = null;
    db = null;
  }
} else {
  console.warn(
    'Firebase is not configured. Set FIREBASE_API_KEY, FIREBASE_APP_ID, and FIREBASE_PROJECT_ID to enable Firebase functionality.'
  );
}

export { auth, db };
export default { app, auth, db, isFirebaseConfigured };