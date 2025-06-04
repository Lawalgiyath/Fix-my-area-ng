
'use client';

import type { AppUser, UserProfileFirestoreData } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import { app } from '@/lib/firebase-config';
import { getAuth, onAuthStateChanged, type User as FirebaseUser, type Auth } from 'firebase/auth';
import { getAppUserProfileFirestore, logoutUser as logoutUserAction } from '@/actions/user-actions';
import { Loader2 } from 'lucide-react';
import { LOCAL_STORAGE_KEYS, PLACEHOLDER_ERROR_DATE_ISO } from '@/lib/constants';

let firebaseAuthInstanceInternal: Auth | null = null;

type UserContextType = {
  currentUser: AppUser | null;
  setCurrentUser: Dispatch<SetStateAction<AppUser | null>>;
  loadingAuth: boolean;
  logout: () => Promise<{success: boolean, error?: string}>;
  reloadUserProfile: (uidToLoad?: string | null) => Promise<AppUser | null>; // Changed return type
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
    createdAt: typeof profileData.createdAt === 'string' ? profileData.createdAt : (profileData.createdAt as any)?.toDate?.().toISOString() || PLACEHOLDER_ERROR_DATE_ISO,
  };
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserInternal] = useState<AppUser | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [currentFirebaseUid, setCurrentFirebaseUid] = useState<string | null>(null);

  const reloadUserProfile = async (uidToLoad?: string | null): Promise<AppUser | null> => {
    const targetUid = uidToLoad || currentFirebaseUid;
    console.log(`[UserContext-reloadUserProfile] Reloading profile for UID: ${targetUid}`);
    if (!targetUid) {
      setCurrentUserInternal(null);
      setLoadingAuth(false);
      console.log(`[UserContext-reloadUserProfile] No target UID, user set to null, loadingAuth false.`);
      return null; // Return null
    }
    setLoadingAuth(true);
    let appUser: AppUser | null = null;
    try {
      const profileData = await getAppUserProfileFirestore(targetUid);
      appUser = convertProfileToAppUser(profileData, targetUid);
      setCurrentUserInternal(appUser);
      console.log(`[UserContext-reloadUserProfile] Profile reloaded:`, appUser);
      if (!appUser && process.env.NEXT_PUBLIC_USE_MOCK_AUTH !== 'true') {
        console.warn(`[UserContext-reloadUserProfile] User profile not found for UID ${targetUid} but Firebase user might exist. Current user set to null.`);
      }
    } catch (error) {
        console.error(`[UserContext-reloadUserProfile] Error reloading profile for UID ${targetUid}:`, error);
        setCurrentUserInternal(null); // Ensure context user is null on error
        appUser = null; // Ensure returned user is null on error
    } finally {
        setLoadingAuth(false);
    }
    return appUser; // Return the loaded user (or null)
  };


  useEffect(() => {
    const effectId = `UserProvider-Effect-${Date.now()}`;
    console.log(`[${effectId}] Running UserProvider effect. Mock Auth: ${process.env.NEXT_PUBLIC_USE_MOCK_AUTH}`);
    setLoadingAuth(true);

    if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true') {
      console.log(`[${effectId}] Mock auth enabled. Checking local storage for current user UID.`);
      const mockUserUid = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER_UID) : null;
      setCurrentFirebaseUid(mockUserUid);
      if (mockUserUid) {
        console.log(`[${effectId}] Found mock user UID in LS: ${mockUserUid}. Fetching profile.`);
        reloadUserProfile(mockUserUid); // This will set currentUserInternal
      } else {
        console.log(`[${effectId}] No mock user UID in LS. No user initially loaded.`);
        setCurrentUserInternal(null);
        setLoadingAuth(false);
      }
      return; 
    }

    // Firebase Auth Path
    if (app) {
      firebaseAuthInstanceInternal = getAuth(app);
    } else {
      console.warn("[UserContext] Firebase app is not initialized (firebase-config.ts). Firebase Auth will be unavailable if not in mock auth mode.");
      setLoadingAuth(false);
      setCurrentUserInternal(null);
      setCurrentFirebaseUid(null);
      return; 
    }
    
    if (!firebaseAuthInstanceInternal) {
        console.warn("[UserContext] firebaseAuthInstanceInternal is null after attempting initialization. Firebase Auth unavailable.");
        setLoadingAuth(false);
        setCurrentUserInternal(null);
        setCurrentFirebaseUid(null);
        return;
    }

    const unsubscribe = onAuthStateChanged(firebaseAuthInstanceInternal, async (firebaseUser: FirebaseUser | null) => {
      const authChangeId = `onAuthChanged-${Date.now()}`;
      console.log(`[${authChangeId}] Auth state changed. Firebase user:`, firebaseUser?.uid || 'null');
      if (firebaseUser) {
        setCurrentFirebaseUid(firebaseUser.uid);
        await reloadUserProfile(firebaseUser.uid); // This will set currentUserInternal
      } else {
        setCurrentUserInternal(null);
        setCurrentFirebaseUid(null);
        if (typeof window !== 'undefined') {
            localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_USER_UID);
            localStorage.removeItem('mockUser'); // Also clear display user on logout
        }
        console.log(`[${authChangeId}] User signed out.`);
        setLoadingAuth(false); 
      }
    });

    return () => {
      console.log(`[${effectId}] Unsubscribing from Firebase onAuthStateChanged.`);
      unsubscribe();
    };
  }, []); 

  const handleLogout = async () => {
    console.log("[UserContext-handleLogout] Initiating logout.");
    setLoadingAuth(true);
    const result = await logoutUserAction(); 
    
    if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true' || !firebaseAuthInstanceInternal) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_USER_UID);
        localStorage.removeItem('mockUser'); 
      }
      setCurrentUserInternal(null);
      setCurrentFirebaseUid(null);
      console.log("[UserContext-handleLogout] Mock/Non-Firebase user logged out, cleared from UserContext and LS.");
    }
    // For Firebase, onAuthStateChanged listener will handle setting currentUser to null.
    
    setLoadingAuth(false);
    return result;
  };


  if (loadingAuth && !currentUser) { 
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p>Initializing Session...</p>
      </div>
    );
  }
  
  const contextValue: UserContextType = {
    currentUser,
    setCurrentUser: setCurrentUserInternal,
    loadingAuth,
    logout: handleLogout,
    reloadUserProfile: reloadUserProfile,
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
