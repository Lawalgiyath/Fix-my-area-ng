
import type { LucideIcon } from 'lucide-react';
import type { Timestamp } from 'firebase/firestore'; // Import Timestamp

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
  title?: 'Mr.' | 'Mrs.' | '';
};

export type Issue = {
  id: string; // Document ID from Firestore
  title: string;
  description: string;
  category: string; // This could be the manually selected one or AI suggested
  status: "Submitted" | "In Progress" | "Resolved" | "Rejected";
  dateReported: string; // Client-side date string when report was initiated
  location: string;
  mediaUrls?: string[]; // URLs to media files (after upload)
  aiClassification?: {
    category: string;
    confidence: number;
  };
  reportedById: string; // ID of the user who reported (e.g., Firebase Auth UID)
  createdAt: Timestamp | Date; // Firestore server timestamp (or Date if converted)
  // Optional: store manual category if different from AI one or primary one
  categoryManual?: string;
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
  fullContent?: string;
  icon: LucideIcon;
  // imageUrl?: string; // Removed
  // dataAiHint?: string; // Removed
};

export type LanguageOption = {
  code: string;
  name: string;
  samplePhrases: { title: string; phrase: string }[];
};
