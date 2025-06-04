
'use server';

import type { Issue, IssueReportData, IssueStatus } from '@/types';
import type { CategorizeIssueOutput } from '@/ai/flows/categorize-issue';
import type { AssessIssueUrgencyOutput } from '@/ai/flows/assess-issue-urgency';
import type { SummarizeIssueOutput } from '@/ai/flows/summarize-issue-flow';
// Firestore imports are removed
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
  mediaUrls: string[], // Will contain file names or dummy URLs
  authUserId: string | null
): Promise<{ success: boolean; error?: string; issueId?: string }> {
  const actionId = `saveIssueReport-${Date.now()}`;
  console.log(`[${actionId}] Saving issue to local storage. User ID: ${authUserId}`);

  if (!authUserId) {
    return { success: false, error: 'Reporter ID (authUserId) is required.' };
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
      mediaUrls: mediaUrls, // Storing file names or mock URLs
      status: 'Submitted',
      reportedById: authUserId,
      dateReported: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      // officialNotes and resolvedAt are optional and not set on creation
    };
    localIssues.push(newIssue);
    saveLocalIssues(localIssues);
    console.log(`[${actionId}] Issue saved to local storage: ${newIssue.id}`);
    return { success: true, issueId: newIssue.id };
  } catch (e) {
    console.error(`[${actionId}] Error saving issue to local storage:`, e);
    let errorMessage = 'Failed to save issue to local storage.';
    if (e instanceof Error) {
      errorMessage = e.message;
    }
    return { success: false, error: errorMessage };
  }
}

export async function getIssuesForUser(userId: string | null): Promise<Issue[]> {
  const actionId = `getIssuesForUser-${Date.now()}`;
  console.log(`[${actionId}] Getting issues for user from local storage: ${userId}`);

  if (!userId) {
    console.warn(`[${actionId}] User ID is null. Returning empty array.`);
    return [];
  }
  try {
    const allIssues = getLocalIssues();
    const userIssues = allIssues.filter(issue => issue.reportedById === userId && issue.status !== "Rejected");
    console.log(`[${actionId}] Found ${userIssues.length} issues in local storage for user ${userId}.`);
    return userIssues.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (e) {
    console.error(`[${actionId}] Error fetching issues for user from local storage:`, e);
    return [];
  }
}

export async function getAllReportedIssues(): Promise<Issue[]> {
  const actionId = `getAllReportedIssues-${Date.now()}`;
  console.log(`[${actionId}] Getting all issues from local storage.`);

  try {
    const allIssues = getLocalIssues();
    console.log(`[${actionId}] Found ${allIssues.length} issues in local storage.`);
    // Filter out rejected issues, and sort by newest first
    return allIssues
        .filter(issue => issue.status !== "Rejected")
        .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (e) {
    console.error(`[${actionId}] Error fetching all issues from local storage:`, e);
    return [];
  }
}


export async function getIssueById(issueId: string): Promise<Issue | null> {
  const actionId = `getIssueById-${Date.now()}`;
   console.log(`[${actionId}] Getting issue by ID from local storage: ${issueId}`);

  if (!issueId) return null;
  try {
    const allIssues = getLocalIssues();
    const foundIssue = allIssues.find(issue => issue.id === issueId);
    console.log(`[${actionId}] Issue found in local storage:`, foundIssue);
    return foundIssue || null;
  } catch (e) {
    console.error(`[${actionId}] Error fetching issue by ID from local storage:`, e);
    return null;
  }
}

export async function updateIssueStatus(issueId: string, newStatus: IssueStatus, officialNotes?: string | null): Promise<{ success: boolean; error?: string }> {
    const actionId = `updateIssueStatus-${Date.now()}`;
    console.log(`[${actionId}] Updating status for issue ID (local storage): ${issueId} to ${newStatus}.`);

    if (!issueId) return { success: false, error: 'Issue ID is missing for update.' };
    try {
        let allIssues = getLocalIssues();
        const issueIndex = allIssues.findIndex(issue => issue.id === issueId);
        if (issueIndex > -1) {
            allIssues[issueIndex].status = newStatus;
            if (officialNotes !== undefined) {
              allIssues[issueIndex].officialNotes = officialNotes;
            }
            if (newStatus === 'Resolved' && !allIssues[issueIndex].resolvedAt) {
                allIssues[issueIndex].resolvedAt = new Date().toISOString();
            }
            saveLocalIssues(allIssues);
            console.log(`[${actionId}] Local storage issue status updated for ${issueId}.`);
            return { success: true };
        }
        return { success: false, error: `Issue with ID ${issueId} not found in local storage.` };
    } catch (e) {
        console.error(`[${actionId}] Error updating local storage issue status:`, e);
        return { success: false, error: 'Failed to update issue status in local storage.' };
    }
}

export async function deleteIssue(issueId: string): Promise<{ success: boolean; error?: string }> {
    const actionId = `deleteIssue-${Date.now()}`;
    console.log(`[${actionId}] Deleting issue ID from local storage: ${issueId}.`);

    if (!issueId) return { success: false, error: 'Issue ID is missing for delete.' };
    try {
        let allIssues = getLocalIssues();
        const initialLength = allIssues.length;
        const filteredIssues = allIssues.filter(issue => issue.id !== issueId);
        if (filteredIssues.length < initialLength) {
            saveLocalIssues(filteredIssues);
            console.log(`[${actionId}] Local storage issue deleted: ${issueId}.`);
            return { success: true };
        }
        return { success: false, error: `Issue with ID ${issueId} not found in local storage.` };
    } catch (e) {
        console.error(`[${actionId}] Error deleting issue from local storage:`, e);
        return { success: false, error: 'Failed to delete issue from local storage.' };
    }
}
