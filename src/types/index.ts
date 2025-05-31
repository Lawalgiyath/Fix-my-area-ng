
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

export type UserProfile = {
  id: string;
  firstName: string;
  lastName:string;
  moniker: string;
  email: string;
  role: UserRole;
  gender?: 'male' | 'female' | 'other';
};

// For localStorage mock registration
export type MockRegisteredUser = {
  email: string;
  firstName: string;
  lastName: string;
  moniker: string;
  gender?: 'male' | 'female' | 'other';
  userType: UserRole;
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

export type Issue = {
  id: string; // Document ID from Firestore
  title: string;
  description: string;
  status: "Submitted" | "In Progress" | "Resolved" | "Rejected";
  dateReported: string; // ISO string (client-side or converted from Firestore Timestamp)
  location: string;
  mediaUrls?: string[]; // URLs to media files (after upload)
  aiClassification?: {
    category: string;
    confidence: number;
  };
  aiUrgencyAssessment?: AIUrgencyAssessment;
  aiSummary?: AISummary; // Added for AI generated summary
  reportedById: string; // ID of the user who reported
  createdAt: string; // ISO string (converted from Firestore Timestamp)
  categoryManual?: string; // Manually selected category by user
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
  author: string;
  lastReply: string;
  repliesCount: number;
  categorySlug: string;
};

export type EducationalContent = {
  id: string;
  title: string;
  summary: string;
  fullContent?: string; // HTML content
  icon: LucideIcon;
  dataAiHint?: string; // For placeholder image context
};

export type LanguageOption = {
  code: string;
  name: string;
  samplePhrases: { title: string; phrase: string }[];
};

