
'use server';

import type { AppUser, UserProfileFirestoreData, UserRegistrationFormData, MockRegisteredUser } from '@/types';
import { app } from '@/lib/firebase-config';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut, type Auth } from 'firebase/auth';
import { LOCAL_STORAGE_KEYS, PLACEHOLDER_ERROR_DATE_ISO } from '@/lib/constants';

// Conditionally initialize Firebase Auth
let auth: Auth | null = null;
if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH !== 'true') {
  if (app) {
    auth = getAuth(app);
  } else {
    // This case should ideally not be reached if firebase-config is set up correctly for non-mock scenarios
    // or if app is intended to be uninitialized.
    console.warn("[user-actions] Firebase app is not initialized. Firebase Auth will be unavailable. Ensure Firebase is configured if not using mock auth.");
  }
}
// If NEXT_PUBLIC_USE_MOCK_AUTH === 'true', auth remains null, and Firebase Auth calls below are bypassed.

function getMockRegisteredUsers(): MockRegisteredUser[] {
  if (typeof window === 'undefined') return [];
  const usersStr = localStorage.getItem(LOCAL_STORAGE_KEYS.REGISTERED_USERS);
  return usersStr ? JSON.parse(usersStr) : [];
}

function saveMockRegisteredUsers(users: MockRegisteredUser[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCAL_STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(users));
}


export async function registerUser(
  formData: UserRegistrationFormData
): Promise<{ success: boolean; error?: string; firebaseUid?: string }> {
  const actionId = `registerUser-${Date.now()}`;
  console.log(`[${actionId}] Registering user. Mock Auth: ${process.env.NEXT_PUBLIC_USE_MOCK_AUTH}`);

  if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true') {
    try {
      const mockUsers = getMockRegisteredUsers();
      if (mockUsers.find(u => u.email === formData.email)) {
        return { success: false, error: 'Email already registered in mock DB.' };
      }
      const newMockUser: MockRegisteredUser = {
        uid: `mock-uid-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        email: formData.email,
        password: formData.password, // Store for mock login check
        firstName: formData.firstName,
        lastName: formData.lastName,
        moniker: formData.moniker,
        gender: formData.gender,
        role: formData.role,
        officialId: formData.officialId,
        createdAt: new Date().toISOString(),
      };
      mockUsers.push(newMockUser);
      saveMockRegisteredUsers(mockUsers);
      console.log(`[${actionId}] Mock user registered: ${newMockUser.uid}`);
      return { success: true, firebaseUid: newMockUser.uid };
    } catch (e) {
      console.error(`[${actionId}] Error during mock registration:`, e);
      return { success: false, error: 'Mock registration failed.' };
    }
  }

  // Firebase Path
  if (!auth) {
    return { success: false, error: 'Firebase Auth is not initialized. Cannot register user. Ensure Firebase config is correct or enable mock auth.' };
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password!);
    const firebaseUser = userCredential.user;
    console.log(`[${actionId}] Firebase user registered: ${firebaseUser.uid}. Profile data NOT saved to Firestore.`);
    return { success: true, firebaseUid: firebaseUser.uid };
  } catch (error: any) {
    console.error(`[${actionId}] Firebase registration error:`, error);
    return { success: false, error: error.message || 'Firebase registration failed.' };
  }
}

export async function loginUser(
  email: string,
  passwordInput: string
): Promise<{ success: boolean; error?: string; firebaseUid?: string }> {
  const actionId = `loginUser-${Date.now()}`;
   console.log(`[${actionId}] Logging in user. Mock Auth: ${process.env.NEXT_PUBLIC_USE_MOCK_AUTH}`);

  if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true') {
    try {
      const mockUsers = getMockRegisteredUsers();
      const user = mockUsers.find(u => u.email === email);
      if (user && user.password === passwordInput) {
        console.log(`[${actionId}] Mock user login successful: ${user.uid}`);
        return { success: true, firebaseUid: user.uid };
      }
      return { success: false, error: 'Invalid mock credentials.' };
    } catch (e) {
      console.error(`[${actionId}] Error during mock login:`, e);
      return { success: false, error: 'Mock login failed.' };
    }
  }

  // Firebase Path
  if (!auth) {
    return { success: false, error: 'Firebase Auth is not initialized. Cannot login user. Ensure Firebase config is correct or enable mock auth.' };
  }
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, passwordInput);
    console.log(`[${actionId}] Firebase user login successful: ${userCredential.user.uid}`);
    return { success: true, firebaseUid: userCredential.user.uid };
  } catch (error: any) {
    console.error(`[${actionId}] Firebase login error:`, error);
    return { success: false, error: error.message || 'Firebase login failed.' };
  }
}

export async function logoutUser(): Promise<{ success: boolean; error?: string }> {
  const actionId = `logoutUser-${Date.now()}`;
  console.log(`[${actionId}] Logging out user. Mock Auth: ${process.env.NEXT_PUBLIC_USE_MOCK_AUTH}`);

  if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true') {
    console.log(`[${actionId}] Mock user logout initiated.`);
    // UserContext will handle clearing local storage UID for mock users
    return { success: true }; 
  }

  // Firebase Path
  if (!auth) {
    console.warn(`[${actionId}] Firebase Auth not initialized. Logout will only affect client state if UserContext handles it (for non-mock scenarios).`);
    return { success: true }; 
  }
  try {
    await firebaseSignOut(auth);
    console.log(`[${actionId}] Firebase user signed out.`);
    return { success: true };
  } catch (error: any) {
    console.error(`[${actionId}] Firebase sign out error:`, error);
    return { success: false, error: error.message || 'Firebase sign out failed.' };
  }
}

// This function now ONLY retrieves from local storage.
// The "Firestore" part of its name is now a misnomer but kept for compatibility with UserContext calls.
export async function getAppUserProfileFirestore(uid: string): Promise<UserProfileFirestoreData | null> {
  const actionId = `getAppUserProfile-${uid.substring(0,5)}-${Date.now()}`;
  console.log(`[${actionId}] Getting user profile (from local storage for ALL modes) for UID: ${uid}.`);

  // ALWAYS fetch from local storage as Firestore is removed for profiles.
  try {
    const mockUsers = getMockRegisteredUsers();
    const user = mockUsers.find(u => u.uid === uid);
    if (user) {
      const profile: UserProfileFirestoreData = {
        uid: user.uid,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        moniker: user.moniker,
        gender: user.gender,
        role: user.role,
        officialId: user.officialId,
        createdAt: user.createdAt, 
      };
      console.log(`[${actionId}] Found user profile in local storage.`);
      return profile;
    }
    console.warn(`[${actionId}] User profile not found in local storage for UID: ${uid}`);
    return null;
  } catch (e) {
    console.error(`[${actionId}] Error fetching user profile from local storage:`, e);
    return null;
  }
}
