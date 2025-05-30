
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

export const APP_NAME = "CivicConnect NG";

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
  {
    id: '1',
    title: 'How to File an Effective Report',
    summary: 'Learn the best practices for reporting issues to ensure prompt attention and resolution from authorities.',
    fullContent: `
### Understanding the Importance of Effective Reporting
When you report an issue, you're not just complaining; you're actively participating in the improvement of your community. An effective report provides clear, concise, and actionable information that helps authorities understand the problem and take appropriate steps. Vague or incomplete reports can lead to delays or misunderstandings.

### Key Elements of an Effective Report:
1.  **Clear and Specific Title:** Your title should immediately tell officials what the issue is. Instead of "Road problem," try "Large Pothole Causing Traffic Hazard on Elm Street."
2.  **Detailed Description:**
    *   **What:** Describe the issue precisely. Is it a broken pipe, an uncollected heap of refuse, a faulty streetlight, or a dangerous road condition?
    *   **Where:** Provide an exact location. Use street names, house numbers, landmarks (e.g., "opposite the blue mosque," "near the big mango tree at the junction"). If possible, mention the local government area or ward.
    *   **When:** When did you first notice the problem? Is it ongoing? Does it happen at specific times?
    *   **Impact:** Explain how the issue affects you or the community. Does it pose a safety risk? Does it disrupt daily life? Does it damage property?
    *   **Photos/Videos (if applicable):** Visual evidence can be very powerful. If you can safely take a clear photo or short video, include it. (The app's report form allows for media attachment).
3.  **Your Contact Information (Optional but Recommended):** Providing your contact details (if you're comfortable) allows authorities to reach out for clarification if needed. This app assumes you're logged in, so your identity might be linked.
4.  **Polite and Respectful Tone:** Even if you're frustrated, maintain a respectful tone. The goal is to get the issue resolved.
5.  **One Issue Per Report:** If you have multiple unrelated issues, file separate reports. This helps in tracking and assigning them to the correct departments.

### Example of a Good vs. Poor Report:
**Poor Report:**
*   Title: Water issue
*   Description: No water in my area. Please fix.

**Effective Report:**
*   Title: No Water Supply for 3 Days in Sunshine Estate, Phase 2
*   Description: Residents of Sunshine Estate, Phase 2, specifically along Bright Avenue and Hope Close, have had no water supply since Monday, July 29th, 2024. This is affecting over 50 households. We have not received any notification about planned maintenance. Please investigate and restore supply urgently.
*   Location: Sunshine Estate, Phase 2 (Bright Avenue & Hope Close)

By following these guidelines, you significantly increase the chances of your report being understood and acted upon quickly. Your contribution is vital for building a better community for everyone.
    `,
    icon: FilePlus2,
    // imageUrl removed
    // dataAiHint removed
  },
  // Other educational content items removed as they were placeholders
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
  // Cleared mock issues. The application will show an empty state.
];

export const MOCK_THREADS: Record<string, ForumThread[]> = {
  'roads-transport': [],
  'waste-management': [],
  'electricity': [],
  'water': [],
  'security': [],
  'other': [],
};
