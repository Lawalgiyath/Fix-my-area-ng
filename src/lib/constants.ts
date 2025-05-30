
import type { NavItem, ForumCategory, EducationalContent, LanguageOption, Issue, ForumThread } from '@/types';
import {
  LayoutDashboard,
  FilePlus2,
  ListChecks,
  MessagesSquare,
  BookOpen,
  Bot,
  Users,
  Shield,
  Car,
  Trash2,
  Zap,
  Droplets,
  BadgeHelp,
  LogOut,
  Settings,
  UserCircle,
  Gavel,
  BarChart3,
  Info
} from 'lucide-react';

export const APP_NAME = "Fix My Area NG";

export const CITIZEN_NAV_ITEMS: NavItem[] = [
  { title: 'Dashboard', href: '/citizen/dashboard', icon: LayoutDashboard, matchStartsWith: true },
  { title: 'Report Issue', href: '/citizen/report-issue', icon: FilePlus2, matchStartsWith: true },
  { title: 'My Reports', href: '/citizen/my-reports', icon: ListChecks, matchStartsWith: true },
  { title: 'Forum', href: '/citizen/forum', icon: MessagesSquare, matchStartsWith: true },
  { title: 'Learn', href: '/citizen/learn', icon: BookOpen, matchStartsWith: true },
  { title: 'Help Guide', href: '/citizen/help', icon: BadgeHelp, matchStartsWith: true },
];

export const OFFICIAL_NAV_ITEMS: NavItem[] = [
  { title: 'Dashboard', href: '/official/dashboard', icon: LayoutDashboard, matchStartsWith: true },
  { title: 'All Reports', href: '/official/all-reports', icon: ListChecks, matchStartsWith: true },
  { title: 'Analytics', href: '/official/analytics', icon: BarChart3, matchStartsWith: true },
];

export const USER_MENU_NAV_ITEMS: NavItem[] = [
    { title: 'Profile', href: '#', icon: UserCircle }, 
    { title: 'Settings', href: '#', icon: Settings }, 
    { title: 'Logout', href: '/', icon: LogOut }, 
];


export const FORUM_CATEGORIES: ForumCategory[] = [
  { slug: 'roads-transport', name: 'Roads & Transport', description: 'Discussions about road conditions, traffic, and public transport.', icon: Car },
  { slug: 'waste-management', name: 'Waste Management', description: 'Topics related to trash collection, recycling, and sanitation.', icon: Trash2 },
  { slug: 'electricity', name: 'Electricity', description: 'Issues and suggestions regarding power supply and electrical infrastructure.', icon: Zap },
  { slug: 'water', name: 'Water Supply', description: 'Conversations about water access, quality, and plumbing.', icon: Droplets },
  { slug: 'security', name: 'Security', description: 'Community safety, policing, and security concerns.', icon: Shield },
  { slug: 'other', name: 'Other Issues', description: 'General discussions for issues not covered in other categories.', icon: Info },
];

export const EDUCATIONAL_CONTENT: EducationalContent[] = [
  // All placeholder educational content removed. 
  // If you had one "real" item, it would also be removed by this request
  // as it's not fetched from a backend.
  // For the prototype to have at least one learnable item, consider adding
  // it back or fetching educational content from a backend service.
];

export const MULTILINGUAL_GUIDE_LANGUAGES: LanguageOption[] = [
  {
    code: 'yo',
    name: 'Yoruba',
    samplePhrases: [
      { title: 'Hello', phrase: 'Bawo ni' },
      { title: 'Thank you', phrase: 'E se' },
      { title: 'Report an issue', phrase: 'Mo fe jabo isoro kan' },
      { title: 'Need help', phrase: 'Mo nilo iranlowo' },
    ],
  },
  {
    code: 'ig',
    name: 'Igbo',
    samplePhrases: [
      { title: 'Hello', phrase: 'Kedu' },
      { title: 'Thank you', phrase: 'Dalu' },
      { title: 'Report an issue', phrase: 'Achọrọ m ịkọ nsogbu' },
      { title: 'Need help', phrase: 'Achọrọ m enyemaka' },
    ],
  },
  {
    code: 'ha',
    name: 'Hausa',
    samplePhrases: [
      { title: 'Hello', phrase: 'Sannu' },
      { title: 'Thank you', phrase: 'Na gode' },
      { title: 'Report an issue', phrase: 'Ina so in kai rahoto matsala' },
      { title: 'Need help', phrase: 'Ina bukatan taimako' },
    ],
  },
];

export const MOCK_ISSUES: Issue[] = [
  // Cleared mock issues. The application will show an empty state or fetch from DB.
];

export const MOCK_THREADS: Record<string, ForumThread[]> = {
  'roads-transport': [],
  'waste-management': [],
  'electricity': [],
  'water': [],
  'security': [],
  'other': [],
};
