'use client';

import type { AppUser, UserProfileFirestoreData } from '@/types'; // Keep types for structure reference
import React, { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
// import { auth as firebaseAuthInstance } from '@/lib/firebase-config'; // Remove Firebase Auth import
// import { onAuthStateChanged, signOut as firebaseSignOut, type User as FirebaseUser } from 'firebase/auth'; // Remove Firebase Auth imports
// import { getAppUserProfileFirestore } from '@/actions/user-actions'; // Remove Firestore action import
import { Loader2 } from 'lucide-react';
// import { Timestamp } from 'firebase/firestore'; // Remove Firestore import

type UserContextType = {
  currentUser: AppUser | null;
  setCurrentUser: Dispatch<SetStateAction<AppUser | null>>; // Keep this for internal state management
  loadingAuth: boolean;
  localLogin: () => void; // Add local login function signature
  localLogout: () => void; // Add local logout function signature
};

const UserContext = createContext<UserContextType | undefined>(undefined);

// const PLACEHOLDER_ERROR_DATE_ISO = '1970-01-01T00:00:00.000Z'; // No longer needed

const LOCAL_STORAGE_USER_KEY = 'localUserId'; // Key for local storage

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserInternal] = useState<AppUser | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Basic login function
  const localLogin = () => {
    const testUserId = 'test-user-123'; // Example user ID
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, testUserId);
    const simplifiedUser: AppUser = {
      uid: testUserId,
      email: 'test@example.com', // Example email
      firstName: 'Local',
      lastName: 'User',
      moniker: 'localuser',
      gender: 'other', // Default
      role: 'citizen', // Hardcoded role
      officialId: undefined,
      createdAt: new Date().toISOString(), // Current time as string
    };
    setCurrentUserInternal(simplifiedUser);
    console.log('Local user logged in:', simplifiedUser);
  };

  // Basic logout function
  const localLogout = () => {
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    setCurrentUserInternal(null);
    console.log('Local user logged out');
  };


  useEffect(() => {
    const effectId = `UserContext-Provider-${Date.now()}`;
    console.log(`[${effectId}] Mounting UserProvider. Initial loadingAuth: ${loadingAuth}`);

    // Check local storage for a user ID
    const storedUserId = localStorage.getItem(LOCAL_STORAGE_USER_KEY);

    if (storedUserId) {
      console.log(`[${effectId}] Found stored user ID in local storage: ${storedUserId}`);
      // Create a simplified user object
      const simplifiedUser: AppUser = {
        uid: storedUserId,
        email: 'local@example.com', // Example email
        firstName: 'Local',
        lastName: 'User',
        moniker: 'localuser',
        gender: 'other', // Default
        role: 'citizen', // Hardcoded role
        officialId: undefined,
        createdAt: new Date().toISOString(), // Current time as string
      };
      setCurrentUserInternal(simplifiedUser);
      console.log(`[${effectId}] Set currentUser from local storage:`, simplifiedUser);
    } else {
      console.log(`[${effectId}] No user ID found in local storage. currentUser remains null.`);
      setCurrentUserInternal(null); // Ensure currentUser is null if no stored ID
    }

    // Simulate a delay for loading, or remove if not needed
    const loadingTimer = setTimeout(() => {
      setLoadingAuth(false);
      console.log(`[${effectId}] Finished initial loading (local storage check).`);
    }, 300); // Simulate a brief loading time

    return () => {
      console.log(`[${effectId}] Unmounting UserProvider. Cleaning up.`);
       clearTimeout(loadingTimer); // Clean up the timer
    };
  }, []); // Empty dependency array: runs once on mount

  if (loadingAuth) {
    const loaderId = `UserContext-Loader-${Date.now()}`;
    console.log(`[${loaderId}] UserProvider rendering 'Initializing Session...' because loadingAuth is TRUE.`);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p>Initializing Session...</p>
      </div>
    );
  }

  console.log(`[UserContext-Render-${Date.now()}] Rendering children. loadingAuth is FALSE. currentUser: ${currentUser ? currentUser.uid + ' ('+ currentUser.role +')' : 'null'}`);
  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser: setCurrentUserInternal, loadingAuth, localLogin, localLogout }}>
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