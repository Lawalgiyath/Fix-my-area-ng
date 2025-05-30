
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
  Info // Added for "Other" category in report form
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
  // { title: 'User Management', href: '/official/users', icon: Users, matchStartsWith: true },
  // { title: 'Settings', href: '/official/settings', icon: Settings, matchStartsWith: true },
];

export const USER_MENU_NAV_ITEMS: NavItem[] = [
    { title: 'Profile', href: '#', icon: UserCircle }, // Placeholder link
    { title: 'Settings', href: '#', icon: Settings }, // Placeholder link
    { title: 'Logout', href: '/', icon: LogOut }, // Ensure this logs out correctly
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
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'writing report'
  },
  {
    id: '2',
    title: 'Understanding Your Civic Rights',
    summary: 'Know your rights as a citizen and how to exercise them responsibly within the Nigerian context.',
    fullContent: 'Civic rights are fundamental to a functioning democracy. This section will detail key rights such as freedom of speech, assembly, right to basic amenities, and how these apply in Nigeria, along with responsibilities. (Full content to be written)',
    icon: Gavel,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'justice law'
  },
  {
    id: '3',
    title: 'What Constitutes Corruption?',
    summary: 'An overview of different forms of corruption, how to identify them, and the impact on society.',
    fullContent: 'Corruption takes many forms, from bribery and extortion to nepotism and embezzlement. This guide will explain these, provide examples, and discuss reporting mechanisms. (Full content to be written)',
    icon: Users, // Consider an icon more specific to corruption or ethics if available, e.g., EyeOff, Ban
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'ethics integrity'
  },
  {
    id: '4',
    title: 'Community Safety Tips',
    summary: 'Practical advice for improving safety and security in your neighborhood, including setting up vigilantes.',
    fullContent: 'Learn about neighborhood watch programs, basic home security, reporting suspicious activities, and collaborating with local law enforcement to enhance community safety. (Full content to be written)',
    icon: Shield,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'neighborhood safety'
  },
  {
    id: '5',
    title: 'The Importance of Waste Management',
    summary: 'Why proper waste disposal and recycling matter for public health, the environment, and aesthetics.',
    fullContent: 'This article explores the health hazards of improper waste disposal, the benefits of recycling, and how individual and community efforts can lead to a cleaner environment. (Full content to be written)',
    icon: Trash2,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'clean environment'
  },
  {
    id: '6',
    title: 'Conserving Water Resources',
    summary: 'Tips and information on how to use water more efficiently at home and in the community.',
    fullContent: 'Water is a precious resource. This guide provides practical tips for reducing water consumption, fixing leaks, and understanding the importance of water conservation for sustainability. (Full content to be written)',
    icon: Droplets,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'water conservation'
  },
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
  { id: '1', title: 'Large pothole on Main Street', description: 'A very large and dangerous pothole has formed on Main Street near the market. It has damaged several car tires.', category: 'Roads & Transport', status: 'Submitted', dateReported: '2024-07-28', location: 'Main Street, near Central Market', reporter: 'Citizen A', aiClassification: { category: "Roads & Transport", confidence: 0.95} },
  { id: '2', title: 'Irregular waste collection', description: 'Waste has not been collected in our area for the past two weeks. It is becoming a health hazard.', category: 'Waste Management', status: 'In Progress', dateReported: '2024-07-25', location: 'Sunshine Estate, Zone 3', reporter: 'Citizen B', aiClassification: { category: "Waste Management", confidence: 0.99}},
  { id: '3', title: 'Frequent power outages', description: 'We experience power outages almost daily, sometimes for several hours. This affects businesses and daily life.', category: 'Electricity', status: 'Resolved', dateReported: '2024-07-20', location: 'Liberty Avenue', reporter: 'Citizen C', aiClassification: { category: "Electricity", confidence: 0.92}},
  { id: '4', title: 'Broken water pipe', description: 'A major water pipe burst this morning, flooding the street and wasting a lot of water.', category: 'Water Supply', status: 'Submitted', dateReported: '2024-07-29', location: 'Unity Close, Off Victory Road', reporter: 'Citizen D', media: ['https://placehold.co/300x200.png', 'https://placehold.co/300x200.png'], aiClassification: { category: "Water", confidence: 0.98}},
  { id: '5', title: 'Street lights not working', description: 'The street lights on Harmony Lane have been out for over a month, making the area unsafe at night.', category: 'Security', status: 'In Progress', dateReported: '2024-07-15', location: 'Harmony Lane, Peaceville', reporter: 'Citizen E', aiClassification: { category: "Electricity", confidence: 0.85}},
];

export const MOCK_THREADS: Record<string, ForumThread[]> = {
  'roads-transport': [
    { id: 'rt1', title: 'Traffic situation at Berger roundabout', author: 'ConcernedCitizen12', lastReply: '2 hours ago', repliesCount: 15, categorySlug: 'roads-transport' },
    { id: 'rt2', title: 'Need for speed bumps on School Road', author: 'ParentGuardian', lastReply: '5 hours ago', repliesCount: 8, categorySlug: 'roads-transport' },
  ],
  'waste-management': [
    { id: 'wm1', title: 'Ideas for community recycling program', author: 'EcoWarrior', lastReply: '1 day ago', repliesCount: 22, categorySlug: 'waste-management' },
  ],
  'electricity': [
     { id: 'el1', title: 'Dealing with transformer vandalism', author: 'PowerUser', lastReply: '3 days ago', repliesCount: 12, categorySlug: 'electricity' },
  ],
  'water': [ // Corrected key from 'water' to 'water-supply' to match FORUM_CATEGORIES slug, this was 'water-supply' earlier, reverting based on user's constant file
     { id: 'ws1', title: 'How to report illegal water connections?', author: 'WaterWatcher', lastReply: 'yesterday', repliesCount: 5, categorySlug: 'water' }, // Also updated categorySlug here
  ],
  'security': [
    { id: 'sc1', title: 'Neighborhood watch initiative forming', author: 'SafeStreets', lastReply: '4 hours ago', repliesCount: 30, categorySlug: 'security' },
  ],
  'other': [],
};
