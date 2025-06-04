
// src/lib/firebase-config.ts
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
// Firestore and Storage imports are removed

// Define the structure of your firebase config for type safety
interface FirebaseConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string; // Still part of config type, but not used for initialization here
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

let app: FirebaseApp;

// Only initialize if Firebase Auth is potentially used (i.e., NEXT_PUBLIC_USE_MOCK_AUTH=false)
// and essential config for Auth is present.
if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH !== 'true') {
  const essentialAuthKeys: (keyof FirebaseConfig)[] = ['apiKey', 'authDomain', 'projectId'];
  const missingAuthKeys = essentialAuthKeys.filter(key => !firebaseConfigValues[key]);

  if (missingAuthKeys.length > 0) {
    console.warn(`Firebase Auth configuration warning: Missing essential environment variables for Firebase Auth: ${missingAuthKeys.join(', ')}. Firebase Auth will not be initialized.`);
    // Create a dummy app object or handle as appropriate if you want to avoid errors later
    // For now, app will remain uninitialized if config is missing and not in mock auth mode.
  } else {
     if (!getApps().length) {
      app = initializeApp(firebaseConfigValues as Required<Pick<FirebaseConfig, 'apiKey' | 'authDomain' | 'projectId'>>);
    } else {
      app = getApps()[0];
    }
  }
} else {
  // In full mock mode, we don't strictly need Firebase App, but some components might expect `app` to be defined.
  // Provide a minimal mock or ensure components handle `app` potentially being undefined if not in mock mode and config missing.
  // For simplicity, if we are mocking auth, we don't initialize firebase app here.
  // The getAuth(app) call in user-actions will need to handle app being undefined.
  // Or, we ensure UserContext and other places check NEXT_PUBLIC_USE_MOCK_AUTH before trying to use firebaseAuthInstance.
  // Let's ensure `getAuth(app)` in `user-actions.ts` is conditional.
}


// db and storage are no longer initialized or exported
export { app }; // Export app (potentially undefined if not initialized)
