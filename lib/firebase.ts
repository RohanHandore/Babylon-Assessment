import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Debug: Log config status (only on client, and only first few chars for security)
if (typeof window !== "undefined") {
  console.log("Firebase config check:", {
    hasApiKey: !!firebaseConfig.apiKey,
    apiKeyValue: firebaseConfig.apiKey || "UNDEFINED",
    apiKeyPreview: firebaseConfig.apiKey ? firebaseConfig.apiKey.substring(0, 10) + "..." : "missing",
    hasAuthDomain: !!firebaseConfig.authDomain,
    authDomainValue: firebaseConfig.authDomain || "UNDEFINED",
    hasProjectId: !!firebaseConfig.projectId,
    projectIdValue: firebaseConfig.projectId || "UNDEFINED",
    hasStorageBucket: !!firebaseConfig.storageBucket,
    hasMessagingSenderId: !!firebaseConfig.messagingSenderId,
    hasAppId: !!firebaseConfig.appId,
    envKeys: Object.keys(process.env).filter(key => key.startsWith("NEXT_PUBLIC_")),
  });
}

// Check if Firebase config is valid
const isFirebaseConfigValid = () => {
  const isValid = !!(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId
  );
  
  if (typeof window !== "undefined" && !isValid) {
    console.warn("Firebase config is missing values:", {
      hasApiKey: !!firebaseConfig.apiKey,
      hasAuthDomain: !!firebaseConfig.authDomain,
      hasProjectId: !!firebaseConfig.projectId,
      hasStorageBucket: !!firebaseConfig.storageBucket,
      hasMessagingSenderId: !!firebaseConfig.messagingSenderId,
      hasAppId: !!firebaseConfig.appId,
    });
  }
  
  return isValid;
};

// Initialize Firebase only on client side and if config is valid
let app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;

// Lazy initialization function
const initializeFirebase = () => {
  if (typeof window === "undefined") {
    return null;
  }

  if (app) {
    return app; // Already initialized
  }

  if (!isFirebaseConfigValid()) {
    console.error("Firebase configuration is invalid. Check your .env.local file.");
    console.error("Config values:", {
      apiKey: firebaseConfig.apiKey ? "present" : "missing",
      authDomain: firebaseConfig.authDomain ? "present" : "missing",
      projectId: firebaseConfig.projectId ? "present" : "missing",
      storageBucket: firebaseConfig.storageBucket ? "present" : "missing",
      messagingSenderId: firebaseConfig.messagingSenderId ? "present" : "missing",
      appId: firebaseConfig.appId ? "present" : "missing",
    });
    return null;
  }

  try {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
      console.log("Firebase initialized successfully");
    } else {
      app = getApps()[0];
    }
    
    // Initialize Firebase services
    _auth = getAuth(app);
    _db = getFirestore(app);
    
    return app;
  } catch (error) {
    console.error("Firebase initialization error:", error);
    return null;
  }
};

// Initialize on client side
if (typeof window !== "undefined") {
  initializeFirebase();
}

// Export getters that ensure initialization
export const getAuthInstance = (): Auth | null => {
  if (typeof window === "undefined") return null;
  if (!_auth) {
    initializeFirebase();
  }
  return _auth;
};

export const getDbInstance = (): Firestore | null => {
  if (typeof window === "undefined") return null;
  if (!_db) {
    initializeFirebase();
  }
  return _db;
};

// Export auth and db - they will be null if not initialized
export const auth: Auth | null = _auth;
export const db: Firestore | null = _db;
export default app;

