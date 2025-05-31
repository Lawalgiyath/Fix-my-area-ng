
'use server';
/**
 * @fileOverview Generates a concise summary for a reported civic issue.
 *
 * - summarizeIssueDescription - A function that handles the issue summarization.
 * - SummarizeIssueInput - The input type for the summarizeIssueDescription function.
 * - SummarizeIssueOutput - The return type for the summarizeIssueDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { AISummary } from '@/types'; // Re-use the type for consistency

const SummarizeIssueInputSchema = z.object({
  issueTitle: z.string().describe('The title of the issue report.'),
  issueDescription: z
    .string()
    .describe('The detailed description of the issue report submitted by the citizen.'),
});
export type SummarizeIssueInput = z.infer<typeof SummarizeIssueInputSchema>;

// Use AISummary for the output schema definition, slightly adapted for Genkit
const SummarizeIssueOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the issue, ideally 1-2 sentences.'),
  confidence: z.number().min(0).max(1).optional().describe('A confidence score (0-1) for the summary generation, if available.'),
});
export type SummarizeIssueOutput = z.infer<typeof SummarizeIssueOutputSchema>;


export async function summarizeIssueDescription(input: SummarizeIssueInput): Promise<SummarizeIssueOutput> {
  return summarizeIssueFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeIssuePrompt',
  input: {schema: SummarizeIssueInputSchema},
  output: {schema: SummarizeIssueOutputSchema},
  prompt: `You are an AI assistant responsible for summarizing civic issue reports for government officials to quickly understand the core problem.
  Based on the issue title and description, provide a concise summary (1-2 sentences max).

  Issue Title: {{{issueTitle}}}
  Issue Description: {{{issueDescription}}}

  Generate a brief summary of the main problem described.
  `,
});

const summarizeIssueFlow = ai.defineFlow(
  {
    name: 'summarizeIssueFlow',
    inputSchema: SummarizeIssueInputSchema,
    outputSchema: SummarizeIssueOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
        return { summary: 'Could not generate summary.', confidence: 0 };
    }
    return output;
  }
);

