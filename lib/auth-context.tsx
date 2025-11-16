import firebaseConfig from '@/app/firebase/firebaseconf';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User
} from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';

const { auth, isFirebaseConfigured } = firebaseConfig;

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOutUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('=== AUTH CONTEXT INIT ===');
    console.log('Firebase configured?', isFirebaseConfigured);
    console.log('Auth object?', !!auth);

    if (!isFirebaseConfigured || !auth) {
      console.warn('Firebase not configured, skipping auth');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'No user');
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('AuthContext.signIn called');
    if (!auth) {
      const error = new Error('Firebase not configured');
      console.error(error);
      throw error;
    }
    
    console.log('Calling signInWithEmailAndPassword...');
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('signInWithEmailAndPassword success:', result.user.uid);
      return;
    } catch (error) {
      console.error('signInWithEmailAndPassword failed:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    console.log('AuthContext.signUp called');
    if (!auth) {
      const error = new Error('Firebase not configured');
      console.error(error);
      throw error;
    }
    
    console.log('Calling createUserWithEmailAndPassword...');
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log('createUserWithEmailAndPassword success:', result.user.uid);
      return;
    } catch (error) {
      console.error('createUserWithEmailAndPassword failed:', error);
      throw error;
    }
  };

  const signOutUser = async () => {
    console.log('AuthContext.signOutUser called');
    if (!auth) {
      const error = new Error('Firebase not configured');
      console.error(error);
      throw error;
    }
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);