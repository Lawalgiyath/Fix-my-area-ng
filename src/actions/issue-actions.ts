
'use server';

import { db } from '@/lib/firebase-config';
import type { Issue, AIUrgencyAssessment, AISummary, IssueReportData } from '@/types';
import { collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import type { CategorizeIssueOutput } from '@/ai/flows/categorize-issue';
import type { AssessIssueUrgencyOutput } from '@/ai/flows/assess-issue-urgency';
import type { SummarizeIssueOutput } from '@/ai/flows/summarize-issue-flow';


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
  authUserId: string | null // Added authenticated user ID parameter
): Promise<{ success: boolean; error?: string; issueId?: string }> {
  try {
    if (!authUserId && process.env.NEXT_PUBLIC_USE_MOCK_AUTH !== 'true') {
      return { success: false, error: 'User is not authenticated. Cannot save report.' };
    }

    // Use authUserId if available and not in mock mode, otherwise fallback to mock ID for mock mode
    const reporterIdToUse = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true' ? 'mock_citizen_user_id' : authUserId;
    if (!reporterIdToUse) {
        return { success: false, error: 'Reporter ID could not be determined.' };
    }


    const issueData: IssueReportData = {
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
      createdAt: serverTimestamp() as Timestamp,
    };

    const docRef = await addDoc(collection(db, 'issues'), issueData);
    console.log('Issue report saved with ID: ', docRef.id);
    return { success: true, issueId: docRef.id };
  } catch (error) {
    console.error('Error saving issue report to Firestore: ', error);
    let errorMessage = 'Failed to save issue report.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    // Firebase permission errors often have a code and more specific message
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'permission-denied') {
        errorMessage = `Permission denied. Please check Firestore rules. Original error: ${errorMessage}`;
    }
    return { success: false, error: errorMessage };
  }
}

