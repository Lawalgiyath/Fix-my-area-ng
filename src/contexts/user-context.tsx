
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
  reloadUserProfile: (uidToLoad?: string | null) => Promise<AppUser | null>;
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
  // This state holds the UID from Firebase Auth or localStorage, used as a trigger for profile loading.
  const [currentAuthUid, setCurrentAuthUid] = useState<string | null>(null);


  const reloadUserProfile = async (uidToLoad?: string | null): Promise<AppUser | null> => {
    let uidForProfileLoad: string | null = uidToLoad;

    if (!uidForProfileLoad) {
      // If no UID is passed, try to get it from currentAuthUid (from context state)
      // or directly from local storage as a fallback.
      uidForProfileLoad = currentAuthUid || (typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER_UID) : null);
    }
    
    console.log(`[UserContext-reloadUserProfile] Attempting to reload profile for UID: ${uidForProfileLoad}`);

    if (!uidForProfileLoad) {
      setCurrentUserInternal(null);
      setLoadingAuth(false); // Ensure loading stops if no UID
      console.log(`[UserContext-reloadUserProfile] No target UID. User set to null, loadingAuth false.`);
      return null;
    }

    // Ensure loadingAuth is true at the start of an actual fetch attempt
    // if it wasn't already set by the main useEffect.
    if (!loadingAuth) setLoadingAuth(true); 

    let appUser: AppUser | null = null;
    try {
      const profileData = await getAppUserProfileFirestore(uidForProfileLoad);
      appUser = convertProfileToAppUser(profileData, uidForProfileLoad);
      setCurrentUserInternal(appUser);
      console.log(`[UserContext-reloadUserProfile] Profile reloaded. CurrentUser in context:`, appUser);
      if (!appUser && process.env.NEXT_PUBLIC_USE_MOCK_AUTH !== 'true') {
        console.warn(`[UserContext-reloadUserProfile] User profile not found for UID ${uidForProfileLoad} (Firebase mode). Current user set to null.`);
      } else if (!appUser && process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true') {
        console.warn(`[UserContext-reloadUserProfile] User profile not found in local storage for UID ${uidForProfileLoad} (Mock mode). Current user set to null.`);
      }
    } catch (error) {
        console.error(`[UserContext-reloadUserProfile] Error reloading profile for UID ${uidForProfileLoad}:`, error);
        setCurrentUserInternal(null);
        appUser = null;
    } finally {
        setLoadingAuth(false);
    }
    return appUser;
  };


  useEffect(() => {
    const effectId = `UserProvider-Effect-${Date.now()}`;
    console.log(`[${effectId}] Running UserProvider effect. Mock Auth: ${process.env.NEXT_PUBLIC_USE_MOCK_AUTH}`);
    setLoadingAuth(true);

    if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true') {
      console.log(`[${effectId}] Mock auth enabled. Checking local storage for current user UID.`);
      const mockUserUidFromStorage = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER_UID) : null;
      setCurrentAuthUid(mockUserUidFromStorage); // Update context's auth UID state
      if (mockUserUidFromStorage) {
        console.log(`[${effectId}] Found mock user UID in LS: ${mockUserUidFromStorage}. Triggering profile reload.`);
        reloadUserProfile(mockUserUidFromStorage); 
      } else {
        console.log(`[${effectId}] No mock user UID in LS. No user initially loaded.`);
        setCurrentUserInternal(null);
        setLoadingAuth(false);
      }
      return; 
    }

    // Firebase Auth Path
    if (!app) {
      console.warn("[UserContext] Firebase app is not initialized (firebase-config.ts). Firebase Auth will be unavailable. Ensure Firebase is configured if not using mock auth.");
      setLoadingAuth(false);
      setCurrentUserInternal(null);
      setCurrentAuthUid(null);
      return;
    }
    
    if (!firebaseAuthInstanceInternal) {
      firebaseAuthInstanceInternal = getAuth(app);
    }
    
    if (!firebaseAuthInstanceInternal) {
        console.warn("[UserContext] firebaseAuthInstanceInternal is null after attempting initialization. Firebase Auth unavailable.");
        setLoadingAuth(false);
        setCurrentUserInternal(null);
        setCurrentAuthUid(null);
        return;
    }

    const unsubscribe = onAuthStateChanged(firebaseAuthInstanceInternal, async (firebaseUser: FirebaseUser | null) => {
      const authChangeId = `onAuthChanged-${Date.now()}`;
      console.log(`[${authChangeId}] Auth state changed. Firebase user:`, firebaseUser?.uid || 'null');
      setCurrentAuthUid(firebaseUser?.uid || null); // Update context's auth UID state

      if (firebaseUser) {
        await reloadUserProfile(firebaseUser.uid);
      } else {
        setCurrentUserInternal(null);
        if (typeof window !== 'undefined') {
            localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_USER_UID);
            localStorage.removeItem('mockUser');
        }
        console.log(`[${authChangeId}] User signed out. Cleared currentUser and local storage UID/mockUser.`);
        setLoadingAuth(false); 
      }
    });

    return () => {
      console.log(`[${effectId}] Unsubscribing from Firebase onAuthStateChanged.`);
      unsubscribe();
    };
  // currentAuthUid should not be a dependency here, as this effect is responsible for setting it based on external auth state.
  // reloadUserProfile should not be a dependency to avoid re-running this entire effect when it's called.
  }, []); 

  const handleLogout = async () => {
    console.log("[UserContext-handleLogout] Initiating logout.");
    setLoadingAuth(true); // Indicate activity
    const result = await logoutUserAction(); 
    
    // For both mock and Firebase, clearing local storage and context state is key.
    // onAuthStateChanged will handle Firebase state, but mock state needs manual reset.
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_USER_UID);
      localStorage.removeItem('mockUser'); 
    }
    setCurrentUserInternal(null);
    setCurrentAuthUid(null); // Clear the auth UID in context
    
    console.log("[UserContext-handleLogout] User logged out. Cleared UserContext and relevant local storage.");
    
    setLoadingAuth(false); // End loading
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

