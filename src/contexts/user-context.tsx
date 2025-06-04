
'use client';

import type { AppUser, UserProfileFirestoreData } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import { auth as firebaseAuthInstance } from '@/lib/firebase-config';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { getAppUserProfileFirestore, loginUser as loginUserAction, logoutUser as logoutUserAction } from '@/actions/user-actions';
import { Loader2 } from 'lucide-react';
import { LOCAL_STORAGE_KEYS, PLACEHOLDER_ERROR_DATE_ISO } from '@/lib/constants';

type UserContextType = {
  currentUser: AppUser | null;
  setCurrentUser: Dispatch<SetStateAction<AppUser | null>>; // Exposed for potential direct updates if ever needed
  loadingAuth: boolean;
  // login: typeof loginUserAction; // Removed to simplify, use actions directly from components
  logout: () => Promise<{success: boolean, error?: string}>;
  reloadUserProfile: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

const convertProfileToAppUser = (profileData: UserProfileFirestoreData | null, firebaseUid: string): AppUser | null => {
  if (!profileData) return null;
  return {
    uid: firebaseUid,
    email: profileData.email,
    firstName: profileData.firstName,
    lastName: profileData.lastName,
    moniker: profileData.moniker,
    gender: profileData.gender,
    role: profileData.role,
    officialId: profileData.officialId,
    createdAt: typeof profileData.createdAt === 'string' ? profileData.createdAt : PLACEHOLDER_ERROR_DATE_ISO,
  };
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserInternal] = useState<AppUser | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [currentFirebaseUid, setCurrentFirebaseUid] = useState<string | null>(null);

  const reloadUserProfile = async (uidToLoad?: string | null) => {
    const targetUid = uidToLoad || currentFirebaseUid;
    if (!targetUid) {
      setCurrentUserInternal(null);
      setLoadingAuth(false);
      return;
    }
    setLoadingAuth(true);
    const profileData = await getAppUserProfileFirestore(targetUid);
    const appUser = convertProfileToAppUser(profileData, targetUid);
    setCurrentUserInternal(appUser);
    if (!appUser && process.env.NEXT_PUBLIC_USE_MOCK_AUTH !== 'true') {
      console.warn(`User profile not found for UID ${targetUid} but Firebase user exists. Logging out.`);
      // Consider if automatic logout is desired here or if app should handle "profile incomplete" state
      // await logoutUserAction(); // This would trigger onAuthStateChanged again
    }
    setLoadingAuth(false);
  };


  useEffect(() => {
    const effectId = `UserProvider-Effect-${Date.now()}`;
    console.log(`[${effectId}] Running UserProvider effect. Mock Auth: ${process.env.NEXT_PUBLIC_USE_MOCK_AUTH}`);
    setLoadingAuth(true);

    if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true') {
      console.log(`[${effectId}] Mock auth enabled. Checking local storage for current user UID.`);
      const mockUserUid = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER_UID) : null;
      if (mockUserUid) {
        console.log(`[${effectId}] Found mock user UID in LS: ${mockUserUid}. Fetching profile.`);
        setCurrentFirebaseUid(mockUserUid); // Keep track of the UID
        getAppUserProfileFirestore(mockUserUid).then(profileData => {
          const appUser = convertProfileToAppUser(profileData, mockUserUid);
          setCurrentUserInternal(appUser);
          console.log(`[${effectId}] Mock user profile loaded:`, appUser);
          setLoadingAuth(false);
        });
      } else {
        console.log(`[${effectId}] No mock user UID in LS. No user initially loaded.`);
        setCurrentUserInternal(null);
        setCurrentFirebaseUid(null);
        setLoadingAuth(false);
      }
      return; // Skip Firebase auth listener
    }

    // Firebase Auth Path
    if (!firebaseAuthInstance) {
        console.error("Firebase Auth instance is not available. Cannot set up auth listener.");
        setLoadingAuth(false);
        setCurrentUserInternal(null);
        setCurrentFirebaseUid(null);
        return;
    }

    const unsubscribe = onAuthStateChanged(firebaseAuthInstance, async (firebaseUser: FirebaseUser | null) => {
      const authChangeId = `onAuthChanged-${Date.now()}`;
      console.log(`[${authChangeId}] Auth state changed. Firebase user:`, firebaseUser?.uid || 'null');
      if (firebaseUser) {
        setCurrentFirebaseUid(firebaseUser.uid);
        // User is signed in, now fetch their app-specific profile.
        const profileData = await getAppUserProfileFirestore(firebaseUser.uid);
        const appUser = convertProfileToAppUser(profileData, firebaseUser.uid);
        setCurrentUserInternal(appUser);
        console.log(`[${authChangeId}] App user profile set:`, appUser);
        if (!appUser) {
          // This case means user is authenticated with Firebase, but no profile in user_profiles collection
          console.warn(`[${authChangeId}] Firebase user ${firebaseUser.uid} authenticated, but no profile found in Firestore.`);
          // Decide how to handle this: redirect to profile creation, show error, or allow limited access.
          // For now, currentUser will be null, and AppShell logic might redirect.
        }
      } else {
        // User is signed out
        setCurrentUserInternal(null);
        setCurrentFirebaseUid(null);
        console.log(`[${authChangeId}] User signed out.`);
      }
      setLoadingAuth(false);
    });

    return () => {
      console.log(`[${effectId}] Unsubscribing from Firebase onAuthStateChanged.`);
      unsubscribe();
    };
  }, []); // Empty dependency array ensures this runs once on mount

  const handleLogout = async () => {
    setLoadingAuth(true);
    const result = await logoutUserAction();
    if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true') {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_USER_UID);
      }
      setCurrentUserInternal(null);
      setCurrentFirebaseUid(null);
      console.log("Mock user logged out, cleared from UserContext and LS.");
    }
    // For Firebase, onAuthStateChanged will handle setting currentUser to null
    setLoadingAuth(false);
    return result;
  };


  if (loadingAuth) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p>Initializing Session...</p>
      </div>
    );
  }
  
  const contextValue: UserContextType = {
    currentUser,
    setCurrentUser: setCurrentUserInternal, // Expose internal setter
    loadingAuth,
    logout: handleLogout,
    reloadUserProfile: () => reloadUserProfile(),
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
