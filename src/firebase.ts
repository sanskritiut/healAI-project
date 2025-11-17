import { getApps, initializeApp } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Attempt to load AsyncStorage for persistence in React Native; fall back gracefully.
let ReactNativeAsyncStorage: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ReactNativeAsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (e) {
  // package not installed — persistence will default to memory in RN
  ReactNativeAsyncStorage = null;
}

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
    // Initialize auth with RN persistence when available
    if (ReactNativeAsyncStorage) {
      try {
        // Load getReactNativePersistence dynamically to avoid web-only import errors
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { getReactNativePersistence } = require('firebase/auth/react-native');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        initializeAuth(app as any, {
          persistence: getReactNativePersistence(ReactNativeAsyncStorage),
        });
      } catch (err) {
        // initializeAuth may not be available on web builds or package not installed
        console.warn('initializeAuth failed or is unavailable; falling back to getAuth', err);
      }
    }
  } else {
    app = getApps()[0];
  }
} else {
  console.warn('Firebase missing required config');
}
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;

export default { app, auth, db, isFirebaseConfigured };
