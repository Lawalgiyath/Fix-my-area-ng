
'use server';

import { db } from '@/lib/firebase-config';
import type { Issue } from '@/types';
import { collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import type { CategorizeIssueOutput } from '@/ai/flows/categorize-issue';

// This type is a subset of the Issue type, representing what we save to Firestore initially.
// Firestore will add an `id` automatically.
type IssueReportData = {
  title: string;
  description: string;
  location: string;
  categoryManual?: string;
  aiClassification?: CategorizeIssueOutput;
  mediaUrls?: string[]; // For now, we're not handling uploads, but preparing for future
  status: Issue['status'];
  reportedById: string; // In a real app, this would be the authenticated user's ID
  dateReported: string; // Client-side date string when report was initiated
  createdAt: Timestamp; // Server-side timestamp
};


export async function saveIssueReport(
  formData: {
    title: string;
    description: string;
    location: string;
    categoryManual?: string;
    // media?: FileList; // Media handling would be complex, store URLs if uploaded elsewhere
  },
  aiResult: CategorizeIssueOutput | null
): Promise<{ success: boolean; error?: string; issueId?: string }> {
  try {
    // In a real app with authentication, get the userId from the session
    const userId = 'mock_citizen_user_id'; // Placeholder

    const issueData: IssueReportData = {
      title: formData.title,
      description: formData.description,
      location: formData.location,
      categoryManual: formData.categoryManual,
      aiClassification: aiResult || undefined,
      mediaUrls: [], // Placeholder, file uploads need separate handling
      status: 'Submitted',
      reportedById: userId,
      dateReported: new Date().toISOString(), // Record client-side submission initiation time
      createdAt: serverTimestamp() as Timestamp, // Firestore server-side timestamp
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
