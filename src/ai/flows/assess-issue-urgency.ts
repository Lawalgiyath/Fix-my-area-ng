
'use server';
/**
 * @fileOverview Assesses the urgency of a reported civic issue.
 *
 * - assessIssueUrgency - A function that handles the issue urgency assessment.
 * - AssessIssueUrgencyInput - The input type for the assessIssueUrgency function.
 * - AssessIssueUrgencyOutput - The return type for the assessIssueUrgency function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { AIUrgencyAssessment } from '@/types'; // Import the shared type

const AssessIssueUrgencyInputSchema = z.object({
  issueTitle: z.string().describe('The title of the issue report.'),
  issueDescription: z
    .string()
    .describe('The detailed description of the issue report submitted by the citizen.'),
});
export type AssessIssueUrgencyInput = z.infer<typeof AssessIssueUrgencyInputSchema>;

// Use the existing AIUrgencyAssessment for the output schema definition
const AssessIssueUrgencyOutputSchema = z.object({
  urgency: z.enum(['Emergency', 'High', 'Medium', 'Low', 'Unknown'])
    .describe('The assessed urgency level of the issue. Options: Emergency, High, Medium, Low, Unknown.'),
  reasoning: z.string().describe('A brief explanation for the assessed urgency level.'),
  confidence: z.number().min(0).max(1).optional().describe('A confidence score (0-1) for the urgency assessment, if available.'),
});
export type AssessIssueUrgencyOutput = z.infer<typeof AssessIssueUrgencyOutputSchema>;


export async function assessIssueUrgency(input: AssessIssueUrgencyInput): Promise<AssessIssueUrgencyOutput> {
  return assessIssueUrgencyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assessIssueUrgencyPrompt',
  input: {schema: AssessIssueUrgencyInputSchema},
  output: {schema: AssessIssueUrgencyOutputSchema},
  prompt: `You are an AI assistant responsible for assessing the urgency of civic issue reports for government officials.
  Based on the issue title and description, determine its urgency level.

  Urgency Levels:
  - Emergency: Immediate threat to life, safety, or critical infrastructure. Requires immediate dispatch. (e.g., collapsed bridge, gas leak, active shooter, major power outage affecting hospital)
  - High: Serious issue causing significant disruption, safety risk, or property damage. Requires prompt attention (within 24-48 hours). (e.g., large pothole on major road, burst water main, fallen power lines not sparking, sewage overflow)
  - Medium: Causes inconvenience, minor safety risk, or could escalate if not addressed. Needs attention within a week. (e.g., broken streetlight, overflowing public bin, non-hazardous debris on road, minor water leak)
  - Low: Minor issue, aesthetic concern, or non-critical maintenance. Can be scheduled. (e.g., faded road markings, graffiti, overgrown park grass)
  - Unknown: Insufficient information to determine urgency.

  Issue Title: {{{issueTitle}}}
  Issue Description: {{{issueDescription}}}

  Provide the urgency level, a brief reasoning for your assessment, and an optional confidence score.
  `,
  config: {
    safetySettings: [ // Add safety settings if needed, e.g., for sensitive content
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
    ],
  }
});

const assessIssueUrgencyFlow = ai.defineFlow(
  {
    name: 'assessIssueUrgencyFlow',
    inputSchema: AssessIssueUrgencyInputSchema,
    outputSchema: AssessIssueUrgencyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    // Ensure the output matches the schema, especially the enum for urgency
    if (!output) {
        return { urgency: 'Unknown', reasoning: 'AI model did not return a valid assessment.', confidence: 0 };
    }
    const validUrgencies = ['Emergency', 'High', 'Medium', 'Low', 'Unknown'];
    if (!validUrgencies.includes(output.urgency)) {
        console.warn(`AI returned invalid urgency: ${output.urgency}. Defaulting to Unknown.`);
        return { ...output, urgency: 'Unknown', reasoning: output.reasoning || "AI returned an invalid urgency level."  };
    }
    return output;
  }
);
