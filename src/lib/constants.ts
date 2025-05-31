
import type { NavItem, ForumCategory, EducationalContent, LanguageOption, Issue, ForumThread } from '@/types';
import {
  LayoutDashboard,
  FilePlus2,
  ListChecks,
  MessagesSquare,
  BookOpen,
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
  Info,
  FileText 
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
  {
    id: '1',
    title: 'How to File an Effective Report',
    summary: 'Learn the best practices for submitting a civic issue report to ensure it gets attention and resolution.',
    icon: FileText,
    dataAiHint: 'document form',
    fullContent: `
      <h2 class="text-xl font-semibold mb-3 text-primary">Filing an Effective Civic Issue Report</h2>
      <p class="mb-4">When you report an issue, providing clear, concise, and complete information is key to helping authorities understand the problem and address it quickly. Here are some best practices:</p>
      <ul class="list-disc list-inside space-y-2 mb-4">
        <li><strong>Be Specific with the Title:</strong> Instead of "Road problem," try "Large pothole on Main Street near the post office."</li>
        <li><strong>Detailed Description:</strong> Explain what the issue is, when you noticed it, its impact, and any potential dangers. For example, "A large pothole, approximately 2 feet wide and 6 inches deep, has formed in the eastbound lane of Main Street, just past the post office. It's been there since July 15th and forces cars to swerve, creating a traffic hazard."</li>
        <li><strong>Accurate Location:</strong> Provide the exact address if possible. If not, use clear landmarks, cross-streets, or a description that makes the location easy to find. "Corner of Elm Avenue and Oak Street, directly in front of the blue fence."</li>
        <li><strong>Attach Clear Media (If Applicable):</strong> Photos or short videos can significantly help illustrate the problem. Ensure your images are well-lit and clearly show the issue. Multiple angles can be beneficial.</li>
        <li><strong>Suggest a Category:</strong> If you know the relevant department or type of issue (e.g., "Roads & Transport," "Waste Management"), selecting the correct category helps route your report faster.</li>
        <li><strong>Be Factual and Polite:</strong> Stick to the facts of the issue. Avoid emotional language or personal attacks. A respectful tone is more likely to be received positively.</li>
        <li><strong>Provide Contact Information (If Required):</strong> Ensure your contact details are up-to-date in case authorities need to follow up with you for more information.</li>
      </ul>
      <p>By following these guidelines, you increase the chances of your report being understood, prioritized, and resolved effectively. Your contribution makes a real difference!</p>
    `,
  },
  {
    id: '2',
    title: 'Understanding Local By-laws',
    summary: 'Learn about common local regulations and how they affect you and your community interactions.',
    icon: Gavel,
    dataAiHint: 'law book',
    fullContent: `
      <h2 class="text-xl font-semibold mb-3 text-primary">Understanding Local By-laws</h2>
      <p class="mb-4">Local by-laws are rules and regulations passed by local government authorities to address specific needs and concerns within their jurisdiction. Understanding these by-laws is crucial for responsible citizenship and harmonious community living.</p>
      <h3 class="text-lg font-semibold mb-2 text-primary/80">Why are By-laws Important?</h3>
      <ul class="list-disc list-inside space-y-2 mb-4">
        <li><strong>Maintaining Order:</strong> By-laws help maintain public order, safety, and health.</li>
        <li><strong>Regulating Activities:</strong> They can regulate activities such as construction, business operations, noise levels, and pet ownership.</li>
        <li><strong>Protecting Property:</strong> Some by-laws are designed to protect property values and ensure responsible land use.</li>
        <li><strong>Environmental Protection:</strong> By-laws often cover waste disposal, tree protection, and water usage to protect the local environment.</li>
      </ul>
      <h3 class="text-lg font-semibold mb-2 text-primary/80">Common Types of By-laws:</h3>
      <ul class="list-disc list-inside space-y-2 mb-4">
        <li><strong>Zoning By-laws:</strong> Control land use (residential, commercial, industrial).</li>
        <li><strong>Noise By-laws:</strong> Regulate acceptable noise levels at different times.</li>
        <li><strong>Waste Management By-laws:</strong> Dictate how garbage, recycling, and organic waste should be handled.</li>
        <li><strong>Parking By-laws:</strong> Control where and when vehicles can be parked.</li>
        <li><strong>Animal Control By-laws:</strong> Address licensing, leashing, and responsible pet ownership.</li>
      </ul>
      <p>You can usually find your local by-laws on your municipal government's website or by contacting your local council office. Being informed about these rules helps you avoid penalties and contribute to a well-managed community.</p>
      <p class="mt-4 italic text-muted-foreground">More specific examples and interpretations relevant to your area may be added here in the future.</p>
    `,
  },
  {
    id: '3',
    title: 'Your Role in Community Safety',
    summary: 'Discover how you can contribute to a safer neighborhood for everyone.',
    icon: Shield,
    dataAiHint: 'community shield',
    fullContent: `
      <h2 class="text-xl font-semibold mb-3 text-primary">Your Role in Community Safety</h2>
      <p class="mb-4">Community safety is not just the responsibility of law enforcement; it's a collective effort where every citizen can play a vital part. Active participation from community members can significantly deter crime and improve the overall quality of life.</p>
      <h3 class="text-lg font-semibold mb-2 text-primary/80">How You Can Contribute:</h3>
      <ul class="list-disc list-inside space-y-3 mb-4">
        <li>
          <strong>Be Observant and Report Suspicious Activity:</strong>
          Trust your instincts. If something feels out of place or suspicious, report it to the relevant authorities or through platforms like Fix My Area NG. Provide as much detail as possible (description of individuals, vehicles, time, location).
        </li>
        <li>
          <strong>Join or Start a Neighborhood Watch:</strong>
          These programs are effective in creating a network of vigilant neighbors who look out for each other and share information about local safety concerns.
        </li>
        <li>
          <strong>Secure Your Property:</strong>
          Simple measures like locking doors and windows, installing adequate lighting, and keeping valuables out of sight can deter opportunistic criminals.
        </li>
        <li>
          <strong>Know Your Neighbors:</strong>
          Building relationships with those who live around you fosters a stronger sense of community. Neighbors who know each other are more likely to notice when something is amiss.
        </li>
        <li>
          <strong>Maintain Your Property:</strong>
          A well-maintained property (e.g., trimmed hedges, clear pathways, no overgrown bushes) can reduce hiding spots for potential offenders and signals that the area is cared for.
        </li>
        <li>
          <strong>Educate Yourself and Others:</strong>
          Stay informed about common local scams or crime trends. Share this information with family and neighbors, especially vulnerable individuals.
        </li>
        <li>
          <strong>Participate in Community Clean-ups and Initiatives:</strong>
          A clean and vibrant neighborhood often experiences less crime. Participating in local improvement projects can make a big difference.
        </li>
      </ul>
      <p>By taking these proactive steps, you contribute to creating a safer and more resilient community for everyone. Your involvement matters!</p>
    `,
  },
   {
    id: '4',
    title: 'Waste Management Best Practices',
    summary: 'Tips for proper waste disposal and contributing to a cleaner environment.',
    icon: Trash2,
    dataAiHint: 'recycling bins',
    fullContent: `
      <h2 class="text-xl font-semibold mb-3 text-primary">Waste Management Best Practices</h2>
      <p class="mb-4">Effective waste management is crucial for public health, environmental protection, and maintaining the aesthetic appeal of our communities. Here are some best practices you can adopt:</p>
      <ul class="list-disc list-inside space-y-2 mb-4">
        <li><strong>Sort Your Waste:</strong> Separate recyclables (paper, plastic, glass, metal) from general waste and organic waste (food scraps, yard trimmings) if your municipality has separate collection programs.</li>
        <li><strong>Reduce and Reuse:</strong> Before recycling or disposing, think if you can reduce consumption or reuse items. Opt for products with minimal packaging and use reusable bags, bottles, and containers.</li>
        <li><strong>Proper Disposal of Hazardous Waste:</strong> Items like batteries, electronics, chemicals, and paint should not be thrown in regular trash. Find out about local hazardous waste collection days or drop-off locations.</li>
        <li><strong>Secure Your Bins:</strong> Keep your waste bins covered to prevent animals from scattering trash and to control odors.</li>
        <li><strong>Follow Collection Schedules:</strong> Put your bins out on the correct day and time as per your local collection schedule. Bring them in promptly after collection.</li>
        <li><strong>Composting:</strong> If feasible, compost organic waste at home. This reduces landfill burden and creates nutrient-rich soil for your garden.</li>
        <li><strong>Avoid Littering:</strong> Always dispose of your trash in designated bins, even when you're away from home. Carry a small bag for your trash if bins aren't readily available.</li>
        <li><strong>Report Illegal Dumping:</strong> If you witness illegal dumping, report it to the authorities. This helps keep public spaces clean and safe.</li>
      </ul>
      <p>By practicing responsible waste management, we can collectively contribute to a cleaner, healthier, and more sustainable environment for everyone.</p>
      <p class="mt-4 italic text-muted-foreground">Check with your local municipality for specific guidelines on waste sorting and collection in your area.</p>
    `
  }
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

export const LOCAL_STORAGE_FORUM_THREADS_KEY = 'civicconnect_forum_threads';

// Initialize MOCK_THREADS with empty arrays for each category slug
// This ensures the structure is available for localStorage initialization
// but starts with no predefined discussions.
export const MOCK_THREADS: Record<string, ForumThread[]> = {
  'roads-transport': [],
  'waste-management': [],
  'electricity': [],
  'water': [],
  'security': [],
  'other': [],
};

    
