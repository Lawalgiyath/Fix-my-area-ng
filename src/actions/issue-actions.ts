
'use server';

import type { Issue, AIUrgencyAssessment, AISummary, IssueReportData, IssueStatus } from '@/types';
import type { CategorizeIssueOutput } from '@/ai/flows/categorize-issue';
import type { AssessIssueUrgencyOutput } from '@/ai/flows/assess-issue-urgency';
import type { SummarizeIssueOutput } from '@/ai/flows/summarize-issue-flow';
import { collection, addDoc, getDocs, query, where, doc, getDoc as getFirestoreDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase-config';
import { LOCAL_STORAGE_KEYS } from '@/lib/constants';

// Helper to get issues from local storage
function getLocalIssues(): Issue[] {
  if (typeof window === 'undefined') return [];
  const issuesStr = localStorage.getItem(LOCAL_STORAGE_KEYS.ISSUES);
  return issuesStr ? JSON.parse(issuesStr) : [];
}

// Helper to save issues to local storage
function saveLocalIssues(issues: Issue[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCAL_STORAGE_KEYS.ISSUES, JSON.stringify(issues));
}

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
  authUserId: string | null
): Promise<{ success: boolean; error?: string; issueId?: string }> {
  const actionId = `saveIssueReport-${Date.now()}`;
  console.log(`[${actionId}] Saving issue. Mock Data: ${process.env.NEXT_PUBLIC_USE_MOCK_DATA}. User ID: ${authUserId}`);

  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    if (!authUserId) {
      return { success: false, error: 'Reporter ID (authUserId) is required for mock mode.' };
    }
    try {
      const localIssues = getLocalIssues();
      const newIssue: Issue = {
        id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        categoryManual: formData.categoryManual,
        category: formData.categoryManual || aiCategorizationResult?.category || 'Other',
        aiClassification: aiCategorizationResult || undefined,
        aiUrgencyAssessment: aiUrgencyResult || undefined,
        aiSummary: aiSummaryResult || undefined,
        mediaUrls: mediaUrls,
        status: 'Submitted',
        reportedById: authUserId,
        dateReported: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      localIssues.push(newIssue);
      saveLocalIssues(localIssues);
      console.log(`[${actionId}] Mock issue saved to local storage: ${newIssue.id}`);
      return { success: true, issueId: newIssue.id };
    } catch (e) {
      console.error(`[${actionId}] Error saving mock issue:`, e);
      return { success: false, error: 'Failed to save mock issue to local storage.' };
    }
  }

  // Firebase Firestore logic
  if (!db) {
    return { success: false, error: 'Firestore is not initialized. Cannot save report.' };
  }
  if (!authUserId) {
    return { success: false, error: 'User is not authenticated (authUserId missing). Cannot save report.' };
  }

  const issueDataToSave: Omit<Issue, 'id' | 'createdAt'> & { createdAt: any } = {
    title: formData.title,
    description: formData.description,
    location: formData.location,
    categoryManual: formData.categoryManual,
    category: formData.categoryManual || aiCategorizationResult?.category || 'Other',
    aiClassification: aiCategorizationResult || undefined,
    aiUrgencyAssessment: aiUrgencyResult || undefined,
    aiSummary: aiSummaryResult || undefined,
    mediaUrls: mediaUrls,
    status: 'Submitted',
    reportedById: authUserId,
    dateReported: new Date().toISOString(),
    createdAt: serverTimestamp(), // Firestore will handle this
  };

  try {
    const docRef = await addDoc(collection(db, "issues"), issueDataToSave);
    console.log(`[${actionId}] Issue report saved to Firestore with ID: ${docRef.id}`);
    return { success: true, issueId: docRef.id };
  } catch (error) {
    console.error(`[${actionId}] Error saving issue report to Firestore: `, error);
    let errorMessage = 'Failed to save issue report to Firestore.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}

export async function getIssuesForUser(userId: string | null): Promise<Issue[]> {
  const actionId = `getIssuesForUser-${Date.now()}`;
  console.log(`[${actionId}] Getting issues for user: ${userId}. Mock Data: ${process.env.NEXT_PUBLIC_USE_MOCK_DATA}`);

  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    if (!userId) {
      console.warn(`[${actionId}] User ID is null for mock mode. Returning empty array.`);
      return [];
    }
    try {
      const allIssues = getLocalIssues();
      const userIssues = allIssues.filter(issue => issue.reportedById === userId);
      console.log(`[${actionId}] Found ${userIssues.length} mock issues for user ${userId}.`);
      return userIssues;
    } catch (e) {
      console.error(`[${actionId}] Error fetching mock issues for user:`, e);
      return [];
    }
  }

  // Firebase Firestore logic
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
    const q = query(issuesCollectionRef, where("reportedById", "==", userId), where("status", "!=", "Rejected")); // Example: Exclude rejected
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

export async function getAllReportedIssues(): Promise<Issue[]> {
  const actionId = `getAllReportedIssues-${Date.now()}`;
  console.log(`[${actionId}] Getting all issues. Mock Data: ${process.env.NEXT_PUBLIC_USE_MOCK_DATA}`);

  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    try {
      const allIssues = getLocalIssues();
      console.log(`[${actionId}] Found ${allIssues.length} mock issues.`);
      return allIssues.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Sort by newest
    } catch (e) {
      console.error(`[${actionId}] Error fetching all mock issues:`, e);
      return [];
    }
  }

  // Firebase Firestore logic
  if (!db) {
    console.error(`[${actionId}] Firestore (db) is not initialized.`);
    return [];
  }
  try {
    const issuesCollectionRef = collection(db, "issues");
    const q = query(issuesCollectionRef, where("status", "!=", "Rejected")); // Example filter
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
    console.log(`[${actionId}] Found ${issues.length} issues in Firestore.`);
    return issues.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error(`[${actionId}] Error fetching all issues from Firestore: `, error);
    return [];
  }
}


export async function getIssueById(issueId: string): Promise<Issue | null> {
  const actionId = `getIssueById-${Date.now()}`;
   console.log(`[${actionId}] Getting issue by ID: ${issueId}. Mock Data: ${process.env.NEXT_PUBLIC_USE_MOCK_DATA}`);

  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    if (!issueId) return null;
    try {
      const allIssues = getLocalIssues();
      const foundIssue = allIssues.find(issue => issue.id === issueId);
      console.log(`[${actionId}] Mock issue found:`, foundIssue);
      return foundIssue || null;
    } catch (e) {
      console.error(`[${actionId}] Error fetching mock issue by ID:`, e);
      return null;
    }
  }

  // Firebase Firestore logic
  if (!db) {
    console.error(`[${actionId}] Firestore (db) is not initialized.`);
    return null;
  }
  if (!issueId) return null;

  try {
    const issueRef = doc(db, "issues", issueId);
    const docSnap = await getFirestoreDoc(issueRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const issue = {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
        dateReported: data.dateReported,
      } as Issue;
      console.log(`[${actionId}] Firestore issue found:`, issue);
      return issue;
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
    console.log(`[${actionId}] Updating status for issue ID: ${issueId} to ${newStatus}. Mock Data: ${process.env.NEXT_PUBLIC_USE_MOCK_DATA}`);

    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
        if (!issueId) return { success: false, error: 'Issue ID is missing for mock update.' };
        try {
            let allIssues = getLocalIssues();
            const issueIndex = allIssues.findIndex(issue => issue.id === issueId);
            if (issueIndex > -1) {
                allIssues[issueIndex].status = newStatus;
                if (officialNotes !== undefined) allIssues[issueIndex].officialNotes = officialNotes;
                if (newStatus === 'Resolved' && !allIssues[issueIndex].resolvedAt) {
                    allIssues[issueIndex].resolvedAt = new Date().toISOString();
                }
                saveLocalIssues(allIssues);
                console.log(`[${actionId}] Mock issue status updated for ${issueId}.`);
                return { success: true };
            }
            return { success: false, error: `Mock issue with ID ${issueId} not found.` };
        } catch (e) {
            console.error(`[${actionId}] Error updating mock issue status:`, e);
            return { success: false, error: 'Failed to update mock issue status.' };
        }
    }

    // Firebase Firestore logic
    if (!db) return { success: false, error: 'Firestore is not initialized.' };
    if (!issueId) return { success: false, error: 'Issue ID is missing.' };

    try {
        const issueRef = doc(db, "issues", issueId);
        const updateData: Partial<Pick<Issue, 'status' | 'officialNotes' | 'resolvedAt'>> = { status: newStatus };
        if (officialNotes !== undefined) updateData.officialNotes = officialNotes;
        if (newStatus === 'Resolved') updateData.resolvedAt = new Date().toISOString(); // Or serverTimestamp() if preferred and handled by type
        
        await updateDoc(issueRef, updateData as any); // Cast as any if serverTimestamp causes type issues client-side
        console.log(`[${actionId}] Firestore issue status updated for ${issueId}.`);
        return { success: true };
    } catch (error) {
        console.error(`[${actionId}] Error updating issue status in Firestore: `, error);
        return { success: false, error: (error instanceof Error ? error.message : 'Failed to update status.') };
    }
}

export async function deleteIssue(issueId: string): Promise<{ success: boolean; error?: string }> {
    const actionId = `deleteIssue-${Date.now()}`;
    console.log(`[${actionId}] Deleting issue ID: ${issueId}. Mock Data: ${process.env.NEXT_PUBLIC_USE_MOCK_DATA}`);

    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
        if (!issueId) return { success: false, error: 'Issue ID is missing for mock delete.' };
        try {
            let allIssues = getLocalIssues();
            const filteredIssues = allIssues.filter(issue => issue.id !== issueId);
            if (filteredIssues.length < allIssues.length) {
                saveLocalIssues(filteredIssues);
                console.log(`[${actionId}] Mock issue deleted: ${issueId}.`);
                return { success: true };
            }
            return { success: false, error: `Mock issue with ID ${issueId} not found.` };
        } catch (e) {
            console.error(`[${actionId}] Error deleting mock issue:`, e);
            return { success: false, error: 'Failed to delete mock issue.' };
        }
    }

    // Firebase Firestore logic
    if (!db) return { success: false, error: 'Firestore is not initialized.' };
    if (!issueId) return { success: false, error: 'Issue ID is missing.' };

    try {
        const issueRef = doc(db, "issues", issueId);
        await deleteDoc(issueRef);
        console.log(`[${actionId}] Firestore issue deleted: ${issueId}.`);
        return { success: true };
    } catch (error) {
         console.error(`[${actionId}] Error deleting issue from Firestore: `, error);
         return { success: false, error: (error instanceof Error ? error.message : 'Failed to delete issue.') };
    }
}
