
'use server';

import { db } from '@/lib/firebase-config';
import type { Issue, AIUrgencyAssessment, AISummary } from '@/types';
import { collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import type { CategorizeIssueOutput } from '@/ai/flows/categorize-issue';
import type { AssessIssueUrgencyOutput } from '@/ai/flows/assess-issue-urgency';
import type { SummarizeIssueOutput } from '@/ai/flows/summarize-issue-flow';


type IssueReportData = {
  title: string;
  description: string;
  location: string;
  categoryManual?: string;
  aiClassification?: CategorizeIssueOutput;
  aiUrgencyAssessment?: AssessIssueUrgencyOutput;
  aiSummary?: AISummary; 
  mediaUrls?: string[]; // Now expected from the form
  status: Issue['status'];
  reportedById: string;
  dateReported: string;
  createdAt: Timestamp;
};


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
  mediaUrls: string[] // Added mediaUrls parameter
): Promise<{ success: boolean; error?: string; issueId?: string }> {
  try {
    const userId = 'mock_citizen_user_id'; // Placeholder

    const issueData: IssueReportData = {
      title: formData.title,
      description: formData.description,
      location: formData.location,
      categoryManual: formData.categoryManual,
      aiClassification: aiCategorizationResult || undefined,
      aiUrgencyAssessment: aiUrgencyResult || undefined,
      aiSummary: aiSummaryResult || undefined,
      mediaUrls: mediaUrls, // Use passed mediaUrls
      status: 'Submitted',
      reportedById: userId,
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
    return { success: false, error: errorMessage };
  }
}
