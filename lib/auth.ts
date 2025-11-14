import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { getAuthInstance, getDbInstance } from "./firebase";

export interface UserData {
  fullName: string;
  email: string;
}

const checkFirebaseConfig = () => {
  const authInstance = getAuthInstance();
  const dbInstance = getDbInstance();
  
  if (!authInstance || !dbInstance) {
    throw new Error(
      "Firebase is not configured. Please set up your .env.local file with Firebase credentials and restart the server."
    );
  }
  
  return { authInstance, dbInstance };
};

export const registerUser = async (
  fullName: string,
  email: string,
  password: string
): Promise<User> => {
  const { authInstance, dbInstance } = checkFirebaseConfig();
  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(
      authInstance,
      email,
      password
    );
    const user = userCredential.user;

    // Update user profile with full name
    await updateProfile(user, {
      displayName: fullName,
    });

    // Store user data in Firestore
    await setDoc(doc(dbInstance, "users", user.uid), {
      fullName: fullName,
      email: email,
      createdAt: new Date().toISOString(),
    }).catch((firestoreError) => {
      // Log Firestore error but don't fail registration
      console.warn("Failed to save user data to Firestore:", firestoreError);
    });

    return user;
  } catch (error: any) {
    // Preserve Firebase error structure
    if (error.code) {
      // It's a Firebase error, throw it as-is
      throw error;
    }
    // Otherwise, wrap it
    throw new Error(error.message || "Registration failed");
  }
};

export const loginUser = async (
  email: string,
  password: string
): Promise<User> => {
  const { authInstance } = checkFirebaseConfig();
  try {
    const userCredential = await signInWithEmailAndPassword(
      authInstance,
      email,
      password
    );
    return userCredential.user;
  } catch (error: any) {
    // Preserve Firebase error structure
    if (error.code) {
      // It's a Firebase error, throw it as-is
      throw error;
    }
    // Otherwise, wrap it
    throw new Error(error.message || "Login failed");
  }
};

export const logoutUser = async (): Promise<void> => {
  const { authInstance } = checkFirebaseConfig();
  try {
    await signOut(authInstance);
  } catch (error: any) {
    throw new Error(error.message || "Logout failed");
  }
};

export const getUserData = async (uid: string): Promise<UserData | null> => {
  const { dbInstance } = checkFirebaseConfig();
  try {
    const userDoc = await getDoc(doc(dbInstance, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    return null;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch user data");
  }
};

