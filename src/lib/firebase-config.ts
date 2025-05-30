
// src/lib/firebase-config.ts
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore"; // Ensure Firestore type is imported

// Define the structure of your firebase config for type safety
interface FirebaseConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

const firebaseConfigValues: FirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// --- Debugging Logs ---
console.log("--- Firebase Config Debug ---");
console.log("Server sees NEXT_PUBLIC_FIREBASE_API_KEY:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
console.log("Server sees NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:", process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
console.log("Server sees NEXT_PUBLIC_FIREBASE_PROJECT_ID:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
console.log("-----------------------------");
// --- End Debugging Logs ---

// Check for missing essential Firebase configuration variables
const essentialConfigKeys: (keyof FirebaseConfig)[] = ['apiKey', 'projectId', 'authDomain'];
const missingKeys = essentialConfigKeys.filter(key => !firebaseConfigValues[key]);

if (missingKeys.length > 0) {
  const errorMessage = `Firebase configuration error: Missing essential environment variables: ${missingKeys.join(', ')}. Please ensure they are set in your .env.local file and the server is restarted.`;
  console.error(errorMessage);
  // Throwing an error here will stop initialization and make the problem clear.
  // This error should be caught by server actions or result in a Next.js error page.
  throw new Error(errorMessage);
}

let app: FirebaseApp;
let db: Firestore; // Use Firestore type

if (!getApps().length) {
  app = initializeApp(firebaseConfigValues as Required<FirebaseConfig>); // Cast because we checked essential keys
} else {
  app = getApps()[0];
}

db = getFirestore(app);

export { app, db };
