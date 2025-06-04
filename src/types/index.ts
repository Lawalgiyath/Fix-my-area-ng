
import type { LucideIcon } from 'lucide-react';

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  label?: string;
  external?: boolean;
  matchStartsWith?: boolean; // For active link matching
};

export type UserRole = "citizen" | "official";

// Represents the user profile data as stored in Firestore or mocked from local storage
export type UserProfileFirestoreData = {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  moniker: string;
  role: UserRole;
  gender?: 'male' | 'female' | 'other';
  officialId?: string;
  createdAt: string | object; // ISO string for client, Firestore Timestamp for server
};

// Represents the user object used throughout the app's context and components
export type AppUser = {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  moniker: string;
  role: UserRole;
  gender?: 'male' | 'female' | 'other';
  officialId?: string;
  createdAt: string; // Always ISO string
};

// For localStorage mock registration and login
export type MockRegisteredUser = {
  uid: string; // Added UID for easier lookup
  email: string;
  password?: string; // For mock login check, not for profile display
  firstName: string;
  lastName: string;
  moniker: string;
  gender?: 'male' | 'female' | 'other';
  role: UserRole; // Changed from userType
  officialId?: string;
  createdAt: string; // ISO string
};

export type UserRegistrationFormData = Omit<MockRegisteredUser, 'uid' | 'createdAt' | 'password'> & {
  password?: string; // Password explicitly for form
  confirmPassword?: string;
};


export type AIUrgencyAssessment = {
  urgency: 'Emergency' | 'High' | 'Medium' | 'Low' | 'Unknown';
  reasoning: string;
  confidence?: number;
};

export type AISummary = {
  summary: string;
  confidence?: number;
};

export type IssueStatus = "Submitted" | "In Progress" | "Resolved" | "Rejected";

// This is the data structure for reporting/saving an issue, before it gets an ID from Firestore
export type IssueReportData = {
  title: string;
  description: string;
  location: string;
  categoryManual?: string;
  mediaUrls?: string[];
  reportedById: string;
  status: IssueStatus;
  aiClassification?: { category: string; confidence: number };
  aiUrgencyAssessment?: AIUrgencyAssessment;
  aiSummary?: AISummary;
  dateReported: string; // ISO string
   // createdAt will be handled by Firestore (serverTimestamp) or set on mock creation
};


export type Issue = {
  id: string; // Document ID from Firestore or local storage
  title: string;
  description: string;
  status: IssueStatus;
  dateReported: string; // ISO string
  location: string;
  mediaUrls?: string[];
  aiClassification?: {
    category: string;
    confidence: number;
  };
  aiUrgencyAssessment?: AIUrgencyAssessment;
  aiSummary?: AISummary;
  reportedById: string;
  createdAt: string; // ISO string
  categoryManual?: string;
  category?: string; // General category, can be manual or AI
  officialNotes?: string; // Notes added by officials
  resolvedAt?: string; // ISO string, when the issue was resolved
};

export type ForumCategory = {
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
};

export type ForumThread = {
  id: string;
  title: string;
  author: string; // Moniker
  authorFirstName?: string;
  categorySlug: string;
  contentPreview: string;
  repliesCount: number;
  lastReply: string; // Could be a date string or user name
  createdAt: string; // ISO string
};

export type StoredForumThreads = Record<string, ForumThread[]>;


export type EducationalContent = {
  id: string;
  title: string;
  summary: string;
  fullContent?: string; // HTML content
  icon: LucideIcon;
  dataAiHint?: string;
};

export type LanguageOption = {
  code: string;
  name: string;
  samplePhrases: { title: string; phrase: string }[];
};
