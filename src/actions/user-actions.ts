
'use server';

import type { AppUser, UserProfileFirestoreData, UserRegistrationFormData, MockRegisteredUser } from '@/types';
import { auth, db } from '@/lib/firebase-config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { LOCAL_STORAGE_KEYS, PLACEHOLDER_ERROR_DATE_ISO } from '@/lib/constants'; // Import keys

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
        // Do NOT store password in LS for real apps; this is purely for mock login.
        // For a slightly better mock, you might hash it or just not store it and always allow login.
        // For this MVP mock, we'll store it to simulate a password check.
        password: formData.password,
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
  if (!auth || !db) {
    return { success: false, error: 'Firebase is not initialized. Cannot register user.' };
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password!);
    const firebaseUser = userCredential.user;

    const userProfileData: Omit<UserProfileFirestoreData, 'createdAt'> = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      moniker: formData.moniker,
      gender: formData.gender,
      role: formData.role,
      officialId: formData.officialId,
    };

    await setDoc(doc(db, "user_profiles", firebaseUser.uid), {
      ...userProfileData,
      createdAt: serverTimestamp(),
    });
    console.log(`[${actionId}] Firebase user registered and profile created: ${firebaseUser.uid}`);
    return { success: true, firebaseUid: firebaseUser.uid };
  } catch (error: any) {
    console.error(`[${actionId}] Firebase registration error:`, error);
    return { success: false, error: error.message || 'Firebase registration failed.' };
  }
}

export async function loginUser(
  email: string,
  passwordInput: string // Renamed to avoid conflict with stored password
): Promise<{ success: boolean; error?: string; firebaseUid?: string }> {
  const actionId = `loginUser-${Date.now()}`;
   console.log(`[${actionId}] Logging in user. Mock Auth: ${process.env.NEXT_PUBLIC_USE_MOCK_AUTH}`);

  if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true') {
    try {
      const mockUsers = getMockRegisteredUsers();
      const user = mockUsers.find(u => u.email === email);
      if (user && user.password === passwordInput) { // Simple password check for mock
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
    return { success: false, error: 'Firebase Auth is not initialized. Cannot login user.' };
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
    // For mock, UserContext will handle clearing the current user UID from LS
    console.log(`[${actionId}] Mock user logout initiated.`);
    return { success: true };
  }

  // Firebase Path
  if (!auth) {
    return { success: false, error: 'Firebase Auth is not initialized.' };
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

export async function getAppUserProfileFirestore(uid: string): Promise<UserProfileFirestoreData | null> {
  const actionId = `getAppUserProfile-${uid.substring(0,5)}-${Date.now()}`;
  console.log(`[${actionId}] Getting user profile for UID: ${uid}. Mock Auth: ${process.env.NEXT_PUBLIC_USE_MOCK_AUTH}`);

  if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true') {
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
          createdAt: user.createdAt, // Already ISO string
        };
        console.log(`[${actionId}] Found mock user profile.`);
        return profile;
      }
      console.warn(`[${actionId}] Mock user profile not found for UID: ${uid}`);
      return null;
    } catch (e) {
      console.error(`[${actionId}] Error fetching mock user profile:`, e);
      return null;
    }
  }

  // Firebase Path
  if (!db) {
    console.error(`[${actionId}] Firestore (db) is not initialized.`);
    return null;
  }
  try {
    const userDocRef = doc(db, "user_profiles", uid);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      const data = userDocSnap.data();
      const profileData = {
        ...data,
        uid: userDocSnap.id,
        // Ensure createdAt is converted to ISO string if it's a Firestore Timestamp
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt || PLACEHOLDER_ERROR_DATE_ISO),
      } as UserProfileFirestoreData;
      console.log(`[${actionId}] Found Firebase user profile.`);
      return profileData;
    } else {
      console.warn(`[${actionId}] No user profile document found in Firestore for UID: ${uid}`);
      return null;
    }
  } catch (error) {
    console.error(`[${actionId}] Error fetching user profile from Firestore:`, error);
    return null;
  }
}
