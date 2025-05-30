
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
  moniker: string; // Added moniker
  email: string;
  role: UserRole;
  gender?: 'male' | 'female' | 'other';
  title?: 'Mr.' | 'Mrs.' | ''; // For salutation
};

export type Issue = {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "Submitted" | "In Progress" | "Resolved" | "Rejected";
  dateReported: string;
  location: string;
  media?: string[]; // URLs to media files
  reporter?: string; // Citizen ID or name
  aiClassification?: {
    category: string;
    confidence: number;
  };
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
  fullContent?: string; // Added for detailed write-ups
  icon: LucideIcon;
  imageUrl?: string;
  dataAiHint?: string;
};

export type LanguageOption = {
  code: string;
  name: string;
  samplePhrases: { title: string; phrase: string }[];
};

