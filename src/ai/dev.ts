
import { config } from 'dotenv';
config();

import '@/ai/flows/categorize-issue.ts';
import '@/ai/flows/assess-issue-urgency.ts'; // Add the new flow
