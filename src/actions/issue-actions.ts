
'use server';

import type { Issue, AIUrgencyAssessment, AISummary, IssueReportData, IssueStatus } from '@/types';
import type { CategorizeIssueOutput } from '@/ai/flows/categorize-issue';
import type { AssessIssueUrgencyOutput } from '@/ai/flows/assess-issue-urgency';
import type { SummarizeIssueOutput } from '@/ai/flows/summarize-issue-flow';
import { collection, addDoc, getDocs, query, where, doc, getDoc as getFirestoreDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase-config';
import { MOCK_ISSUES } from '@/lib/constants'; // Used for local storage fallback for now

export async function saveIssueReport(
  formData: {
    title: string;
    description: string;
    location: string;
    categoryManual?: string;
  },
  aiCategorizationResult: CategorizeIssueOutput | null,
  aiUrgencyResult: AssessIssueUrgencyOutput | null,
  aiSummaryResult: SummarizeIssueOutput | null,
  mediaUrls: string[],
  authUserId: string | null // Authenticated user's ID
): Promise<{ success: boolean; error?: string; issueId?: string }> {
  const actionId = `saveIssueReport-${Date.now()}`;
  try {
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
      // Local storage fallback
      console.warn(`[${actionId}] Mock data mode: Using local storage for issue report.`);
      const issueId = `local-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      const reporterIdToUse = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true' ? 'mock_citizen_user_id' : authUserId;
      if (!reporterIdToUse) {
          return { success: false, error: 'Reporter ID could not be determined for mock mode.' };
      }

      const newIssue: Issue = {
        id: issueId,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        categoryManual: formData.categoryManual,
        aiClassification: aiCategorizationResult || undefined,
        aiUrgencyAssessment: aiUrgencyResult || undefined,
        aiSummary: aiSummaryResult || undefined,
        mediaUrls: mediaUrls,
        status: 'Submitted',
        reportedById: reporterIdToUse, // Use the determined reporter ID
        dateReported: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      const existingIssuesString = typeof window !== 'undefined' ? localStorage.getItem('localIssues') : null;
      const existingIssues: Issue[] = existingIssuesString ? JSON.parse(existingIssuesString) : [];
      existingIssues.push(newIssue);
      if (typeof window !== 'undefined') {
        localStorage.setItem('localIssues', JSON.stringify(existingIssues));
      }
      console.log(`[${actionId}] Issue report saved to local storage with ID: ${issueId}`);
      return { success: true, issueId: issueId };
    }

    // Firebase Firestore logic
    if (!db) {
      return { success: false, error: 'Firestore is not initialized. Cannot save report.' };
    }
    
    if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH !== 'true' && !authUserId) {
      return { success: false, error: 'User is not authenticated. Cannot save report.' };
    }
    const reporterIdToUseFb = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true' ? 'mock_citizen_user_id' : authUserId;

    if (!reporterIdToUseFb) {
        return { success: false, error: 'Reporter ID could not be determined.' };
    }

    const issueData: Omit<Issue, 'id'> = {
      title: formData.title,
      description: formData.description,
      location: formData.location,
      categoryManual: formData.categoryManual,
      aiClassification: aiCategorizationResult || undefined,
      aiUrgencyAssessment: aiUrgencyResult || undefined,
      aiSummary: aiSummaryResult || undefined,
      mediaUrls: mediaUrls,
      status: 'Submitted',
      reportedById: reporterIdToUseFb, // Use the determined reporter ID for Firestore
      dateReported: new Date().toISOString(),
      createdAt: serverTimestamp() as unknown as string,
    };

    const docRef = await addDoc(collection(db, "issues"), issueData);
    console.log(`[${actionId}] Issue report saved to Firestore with ID: ${docRef.id}`);
    return { success: true, issueId: docRef.id };

  } catch (error) {
    console.error(`[${actionId}] Error saving issue report: `, error);
    let errorMessage = 'Failed to save issue report.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}


export async function getIssuesForUser(userId: string | null): Promise<Issue[]> {
    const actionId = `getIssuesForUser-${Date.now()}`;
    console.log(`[${actionId}] Attempting to get issues for user ID: ${userId}`);

    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
        console.warn(`[${actionId}] Mock data mode: Using local storage for getIssuesForUser.`);
        if (!userId) {
            console.warn(`[${actionId}] User ID is null. Returning empty array for mock mode.`);
            return [];
        }
        const existingIssuesString = typeof window !== 'undefined' ? localStorage.getItem('localIssues') : null;
        const allIssues: Issue[] = existingIssuesString ? JSON.parse(existingIssuesString) : [];
        const userIssues = allIssues.filter(issue => issue.reportedById === userId);
        console.log(`[${actionId}] Found ${userIssues.length} issues in local storage for user ID: ${userId}`);
        return userIssues;
    }

    if (!db) {
      console.error(`[${actionId}] Firestore (db) is not initialized.`);
      return [];
    }
    if (!userId) {
        console.warn(`[${actionId}] User ID is null. Cannot fetch Firestore issues.`);
        return [];
    }

    try {
        const issuesCollectionRef = collection(db, "issues");
        const q = query(issuesCollectionRef, where("reportedById", "==", userId));
        const querySnapshot = await getDocs(q);
        const issues: Issue[] = [];
        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            issues.push({
                id: docSnap.id,
                ...data,
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
                dateReported: data.dateReported, 
            } as Issue);
        });
        console.log(`[${actionId}] Found ${issues.length} issues in Firestore for user ID: ${userId}`);
        return issues;
    } catch (error) {
        console.error(`[${actionId}] Error fetching issues for user from Firestore: `, error);
        return [];
    }
}

export async function getIssueById(issueId: string): Promise<Issue | null> {
    const actionId = `getIssueById-${Date.now()}`;
    console.log(`[${actionId}] Attempting to get issue by ID: ${issueId}`);

    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
        console.warn(`[${actionId}] Mock data mode: Using local storage for getIssueById.`);
         if (!issueId) {
            console.warn(`[${actionId}] Issue ID is null or undefined for local storage fetch. Returning null.`);
            return null;
        }
        const existingIssuesString = typeof window !== 'undefined' ? localStorage.getItem('localIssues') : null;
        const allIssues: Issue[] = existingIssuesString ? JSON.parse(existingIssuesString) : [];
        const foundIssue = allIssues.find(issue => issue.id === issueId);
        if (foundIssue) {
            console.log(`[${actionId}] Found issue in local storage with ID: ${issueId}`);
            return foundIssue;
        } else {
            console.warn(`[${actionId}] Issue with ID ${issueId} not found in local storage.`);
            return null;
        }
    }
    
    if (!db) {
      console.error(`[${actionId}] Firestore (db) is not initialized.`);
      return null;
    }
    if (!issueId) {
        console.warn(`[${actionId}] Issue ID is null or undefined for Firestore fetch. Returning null.`);
        return null;
    }

    try {
        const issueRef = doc(db, "issues", issueId);
        const docSnap = await getFirestoreDoc(issueRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            console.log(`[${actionId}] Found issue in Firestore with ID: ${issueId}`);
            return {
                id: docSnap.id,
                ...data,
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
                dateReported: data.dateReported,
            } as Issue;
        } else {
            console.warn(`[${actionId}] Issue with ID ${issueId} not found in Firestore.`);
            return null;
        }
    } catch (error) {
        console.error(`[${actionId}] Error fetching issue by ID from Firestore: `, error);
        return null;
    }
}

export async function updateIssueStatus(issueId: string, newStatus: IssueStatus, officialNotes?: string | null): Promise<{ success: boolean; error?: string }> {
    const actionId = `updateIssueStatus-${Date.now()}`;
    console.log(`[${actionId}] Attempting to update status for issue ID: ${issueId} to ${newStatus}`);

    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
        console.warn(`[${actionId}] Mock data mode: Using local storage for updateIssueStatus.`);
         if (!issueId) {
            return { success: false, error: 'Issue ID is missing for local storage update.' };
        }
        const existingIssuesString = typeof window !== 'undefined' ? localStorage.getItem('localIssues') : null;
        let allIssues: Issue[] = existingIssuesString ? JSON.parse(existingIssuesString) : [];
        const issueIndex = allIssues.findIndex(issue => issue.id === issueId);
        if (issueIndex > -1) {
            allIssues[issueIndex].status = newStatus;
            // Add officialNotes and resolvedAt logic if needed for local storage and if present in Issue type
            if (typeof window !== 'undefined') localStorage.setItem('localIssues', JSON.stringify(allIssues));
            console.log(`[${actionId}] Successfully updated status in local storage for issue ID: ${issueId}`);
            return { success: true };
        } else {
            return { success: false, error: `Issue with ID ${issueId} not found in local storage for status update.` };
        }
    }

    if (!db) {
      return { success: false, error: 'Firestore is not initialized. Cannot update status.' };
    }
    if (!issueId) {
        return { success: false, error: 'Issue ID is missing for Firestore update.' };
    }

    try {
        const issueRef = doc(db, "issues", issueId);
        const updateData: Partial<Pick<Issue, 'status'>> = { status: newStatus };
        // Add officialNotes and resolvedAt logic if needed for Firestore and if present in Issue type
        // e.g. if (officialNotes !== undefined) updateData.officialNotes = officialNotes;
        // if (newStatus === 'Resolved') updateData.resolvedAt = serverTimestamp() as any;
        await updateDoc(issueRef, updateData);
        console.log(`[${actionId}] Successfully updated status in Firestore for issue ID: ${issueId}`);
        return { success: true };
    } catch (error) {
        console.error(`[${actionId}] Error updating issue status in Firestore: `, error);
        let errorMessage = 'Failed to update issue status.';
         if (error instanceof Error) errorMessage = error.message;
        return { success: false, error: errorMessage };
    }
}

export async function deleteIssue(issueId: string): Promise<{ success: boolean; error?: string }> {
    const actionId = `deleteIssue-${Date.now()}`;
    console.log(`[${actionId}] Attempting to delete issue with ID: ${issueId}`);

     if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
        console.warn(`[${actionId}] Mock data mode: Using local storage for deleteIssue.`);
         if (!issueId) {
            return { success: false, error: 'Issue ID is missing for local storage deletion.' };
        }
        const existingIssuesString = typeof window !== 'undefined' ? localStorage.getItem('localIssues') : null;
        let allIssues: Issue[] = existingIssuesString ? JSON.parse(existingIssuesString) : [];
        const filteredIssues = allIssues.filter(issue => issue.id !== issueId);
        if (filteredIssues.length < allIssues.length) {
            if (typeof window !== 'undefined') localStorage.setItem('localIssues', JSON.stringify(filteredIssues));
            console.log(`[${actionId}] Successfully deleted issue from local storage with ID: ${issueId}`);
            return { success: true };
        } else {
            return { success: false, error: `Issue with ID ${issueId} not found in local storage for deletion.` };
        }
    }

    if (!db) {
      return { success: false, error: 'Firestore is not initialized. Cannot delete issue.' };
    }
    if (!issueId) {
        return { success: false, error: 'Issue ID is missing for Firestore deletion.' };
    }

    try {
        const issueRef = doc(db, "issues", issueId);
        await deleteDoc(issueRef);
        console.log(`[${actionId}] Successfully deleted issue from Firestore with ID: ${issueId}`);
        return { success: true };
    } catch (error) {
         console.error(`[${actionId}] Error deleting issue from Firestore: `, error);
         let errorMessage = 'Failed to delete issue.';
          if (error instanceof Error) errorMessage = error.message;
         return { success: false, error: errorMessage };
    }
}

    