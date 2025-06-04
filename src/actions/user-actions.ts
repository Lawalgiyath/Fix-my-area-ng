// src/actions/user-actions.ts
// import { db } from '@/lib/firebase-config'; // Remove this import
// import { doc, getDoc } from 'firebase/firestore'; // Remove this import
import type { AppUser, UserProfileFirestoreData, UserRole } from '@/types'; // Keep this import
import { PLACEHOLDER_ERROR_DATE_ISO } from '@/contexts/user-context'; // Keep this import if still needed for timestamps

// Simulate a local storage key for user data
const LOCAL_USER_DATA_KEY = 'localUserData';

/**
 * Simulates fetching a user profile from local storage.
 * In a full local storage implementation, you might store multiple users
 * and retrieve the one matching the UID. For simplicity here, we'll just
 * check for a single 'localUserData' item and return a simplified profile
 * if the UID matches or simulate a default if not found.
 * @param uid The UID of the user to fetch.
 * @returns A simplified UserProfileFirestoreData object or null.
 */
export async function getAppUserProfileFirestore(uid: string): Promise<UserProfileFirestoreData | null> {
  console.log(`[getAppUserProfileFirestore] Attempting to fetch user profile from local storage for UID: ${uid}`);
  if (!uid) {
    console.warn(`[getAppUserProfileFirestore] UID is null or undefined. Cannot fetch profile.`);
    return null;
  }

  try {
    const localUserDataString = localStorage.getItem(LOCAL_USER_DATA_KEY);

    if (localUserDataString) {
      const localUserData = JSON.parse(localUserDataString);

      // In a real scenario, you might iterate or look up by uid
      // For this simple example, let's assume localUserData contains a single user object
      // or you're just checking if *any* user data exists and matches the requested UID.

      // Simple check if the stored data has the expected UID
      if (localUserData && typeof localUserData === 'object' && localUserData.uid === uid) {
        console.log(`[getAppUserProfileFirestore] Found user data in local storage for UID: ${uid}.`);
        // Return a simplified UserProfileFirestoreData based on local storage data
        // Ensure required fields are present or defaulted
        return {
          uid: localUserData.uid,
          email: localUserData.email || `${uid}@localhost.com`, // Default email if not stored
          firstName: localUserData.firstName || 'Local',
          lastName: localUserData.lastName || 'User',
          moniker: localUserData.moniker || `user-${uid.substring(0, 5)}`,
          gender: localUserData.gender || 'other',
          role: (localUserData.role as UserRole) || 'citizen', // Default role
          officialId: localUserData.officialId, // Optional
          // Simulate createdAt as a string since Timestamp isn't used with local storage
          createdAt: localUserData.createdAt || new Date().toISOString(), // Store/retrieve as ISO string
        } as UserProfileFirestoreData; // Cast to the type
      } else {
        console.warn(`[getAppUserProfileFirestore] Local storage data found, but UID does not match or data is unexpected for UID: ${uid}. Data:`, localUserData);
        // Fallback or simulate default if data doesn't match or is missing UID
      }
    } else {
       console.log(`[getAppUserProfileFirestore] No user data found in local storage.`);
    }

    // If no matching data found in local storage for the specific UID,
    // you can either return null or simulate a default user if needed for testing.
    // For this implementation, let's return null if no matching data is found for the requested UID.
    console.log(`[getAppUserProfileFirestore] No matching user data in local storage for UID ${uid}. Returning null.`);
    return null;


  } catch (error) {
    console.error(`[getAppUserProfileFirestore] Error reading from local storage or parsing data for UID ${uid}:`, error);
    return null;
  }
}

// You might still need other user-related actions that don't involve Firestore fetching,
// or you would modify them to use local storage as well.
// For example, a function to save/update a user profile in local storage:
/*
export async function saveUserProfileLocal(uid: string, profileData: Partial<UserProfileFirestoreData>): Promise<void> {
    console.log(`[saveUserProfileLocal] Attempting to save user profile to local storage for UID: ${uid}`);
    if (!uid) {
        console.warn(`[saveUserProfileLocal] UID is null or undefined. Cannot save profile.`);
        return;
    }

    try {
        const existingDataString = localStorage.getItem(LOCAL_USER_DATA_KEY);
        let existingData = {};
        if (existingDataString) {
            try {
                 existingData = JSON.parse(existingDataString);
            } catch (parseError) {
                 console.error("[saveUserProfileLocal] Failed to parse existing local storage data, overwriting.", parseError);
                 existingData = {}; // Start fresh if parsing fails
            }
        }

        // Merge existing data with new profile data, ensuring UID is consistent
        const updatedData = {
            ...existingData,
            ...profileData,
            uid: uid // Ensure UID is correct
        };

        localStorage.setItem(LOCAL_USER_DATA_KEY, JSON.stringify(updatedData));
        console.log(`[saveUserProfileLocal] Successfully saved user profile to local storage for UID: ${uid}.`);

    } catch (error) {
         console.error(`[saveUserProfileLocal] Error saving user profile to local storage for UID ${uid}:`, error);
    }
}
*/