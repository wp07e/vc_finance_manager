import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { firebaseConfig } from "@/config/firebase";
import { useEffect } from "react";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export async function registerWithEmailAndPassword(
  email: string,
  password: string,
): Promise<User> {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );
  await sendEmailVerification(userCredential.user);
  return userCredential.user;
}

export async function loginWithEmailAndPassword(
  email: string,
  password: string,
): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );
  return userCredential.user;
}

export async function logout(): Promise<void> {
  await signOut(auth);
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

export function getCurrentUser(): User | null {
  return auth.currentUser;
}

export { auth };
