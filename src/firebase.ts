import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCHapsoVKSnQJlynX1xBgiGQmMtAY6Zdo4',
  authDomain: 'healai-b9bfb.firebaseapp.com',
  projectId: 'healai-b9bfb',
  storageBucket: 'healai-b9bfb.firebasestorage.app',
  messagingSenderId: '915874161016',
  appId: '1:915874161016:web:d9937dd480c02679a7a88d',
  measurementId: 'G-T9EEWJW2Y9'
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.appId && firebaseConfig.projectId
);

let app = null;

if (isFirebaseConfigured) {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
} else {
  console.warn('Firebase missing required config');
}

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;

export default { app, auth, db, isFirebaseConfigured };
