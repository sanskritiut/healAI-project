import { auth, isFirebaseConfigured } from '@/app/firebase/firebaseconf';
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    type User as FirebaseUser,
} from 'firebase/auth';
import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

type AuthUser = FirebaseUser | null;

type AuthContextType = {
  user: AuthUser;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      // If Firebase is not configured, skip listening and set loading to false.
      setUser(null);
      setLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u ?? null);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  async function signIn(email: string, password: string) {
    if (!isFirebaseConfigured || !auth) throw new Error('Firebase is not configured');
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function signUp(email: string, password: string) {
    if (!isFirebaseConfigured || !auth) throw new Error('Firebase is not configured');
    await createUserWithEmailAndPassword(auth, email, password);
  }

  async function signOutUser() {
    if (!isFirebaseConfigured || !auth) return;
    await signOut(auth);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
}
