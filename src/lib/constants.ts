import type { NavItem, ForumCategory, EducationalContent, LanguageOption, Issue } from '@/types';
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
  BarChart3
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
  { slug: 'other', name: 'Other Issues', description: 'General discussions for issues not covered in other categories.', icon: MessagesSquare },
];

export const EDUCATIONAL_CONTENT: EducationalContent[] = [
  { id: '1', title: 'How to File an Effective Report', summary: 'Learn the best practices for reporting issues to ensure they get attention.', icon: FilePlus2, imageUrl: 'https://placehold.co/600x400', dataAiHint: 'writing report' },
  { id: '2', title: 'Understanding Your Civic Rights', summary: 'Know your rights as a citizen and how to exercise them responsibly.', icon: Gavel, imageUrl: 'https://placehold.co/600x400', dataAiHint: 'justice law' },
  { id: '3', title: 'What Constitutes Corruption?', summary: 'An overview of different forms of corruption and how to identify them.', icon: Users, imageUrl: 'https://placehold.co/600x400', dataAiHint: 'government meeting' },
  { id: '4', title: 'Community Safety Tips', summary: 'Practical advice for improving safety and security in your neighborhood.', icon: Shield, imageUrl: 'https://placehold.co/600x400', dataAiHint: 'community people' },
  { id: '5', title: 'The Importance of Waste Management', summary: 'Why proper waste disposal and recycling matter for public health and the environment.', icon: Trash2, imageUrl: 'https://placehold.co/600x400', dataAiHint: 'clean environment' },
  { id: '6', title: 'Conserving Water Resources', summary: 'Tips and information on how to use water more efficiently.', icon: Droplets, imageUrl: 'https://placehold.co/600x400', dataAiHint: 'water conservation' },
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
  { id: '4', title: 'Broken water pipe', description: 'A major water pipe burst this morning, flooding the street and wasting a lot of water.', category: 'Water Supply', status: 'Submitted', dateReported: '2024-07-29', location: 'Unity Close, Off Victory Road', reporter: 'Citizen D', aiClassification: { category: "Water", confidence: 0.98}},
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
  'water-supply': [
     { id: 'ws1', title: 'How to report illegal water connections?', author: 'WaterWatcher', lastReply: 'yesterday', repliesCount: 5, categorySlug: 'water-supply' },
  ],
  'security': [
    { id: 'sc1', title: 'Neighborhood watch initiative forming', author: 'SafeStreets', lastReply: '4 hours ago', repliesCount: 30, categorySlug: 'security' },
  ],
  'other': [],
};
