
import type { LucideIcon } from 'lucide-react';
import type { Timestamp } from 'firebase/firestore';

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
  // title is derived, not stored
};

export type Issue = {
  id: string; // Document ID from Firestore
  title: string;
  description: string;
  // category: string; // This can be derived from aiClassification or categoryManual
  status: "Submitted" | "In Progress" | "Resolved" | "Rejected";
  dateReported: string; // ISO string from client-side initiation or server
  location: string;
  mediaUrls?: string[]; // URLs to media files (after upload)
  aiClassification?: {
    category: string;
    confidence: number;
  };
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
  id: '1'; // Only one item now
  title: string;
  summary: string;
  fullContent?: string;
  icon: LucideIcon;
};

export type LanguageOption = {
  code: string;
  name: string;
  samplePhrases: { title: string; phrase: string }[];
};
