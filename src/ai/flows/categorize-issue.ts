'use server';

/**
 * @fileOverview Automatically categorizes issues based on report content.
 *
 * - categorizeIssue - A function that handles the issue categorization process.
 * - CategorizeIssueInput - The input type for the categorizeIssue function.
 * - CategorizeIssueOutput - The return type for the categorizeIssue function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeIssueInputSchema = z.object({
  reportContent: z
    .string()
    .describe('The content of the issue report submitted by the citizen.'),
});
export type CategorizeIssueInput = z.infer<typeof CategorizeIssueInputSchema>;

const CategorizeIssueOutputSchema = z.object({
  category: z
    .string()
    .describe(
      'The predicted category of the issue.  For example: Roads & Transport, Waste Management, Electricity, Water, Security, or Other.'
    ),
  confidence: z
    .number()
    .describe(
      'A number between 0 and 1 indicating the confidence level of the categorization.'
    ),
});
export type CategorizeIssueOutput = z.infer<typeof CategorizeIssueOutputSchema>;

export async function categorizeIssue(input: CategorizeIssueInput): Promise<CategorizeIssueOutput> {
  return categorizeIssueFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeIssuePrompt',
  input: {schema: CategorizeIssueInputSchema},
  output: {schema: CategorizeIssueOutputSchema},
  prompt: `You are an AI assistant that categorizes civic issue reports.

  Given the content of a citizen's issue report, predict the most relevant category and a confidence level for your prediction.

  The possible categories are: Roads & Transport, Waste Management, Electricity, Water, Security, or Other.

  Report Content: {{{reportContent}}}
  `,
});

const categorizeIssueFlow = ai.defineFlow(
  {
    name: 'categorizeIssueFlow',
    inputSchema: CategorizeIssueInputSchema,
    outputSchema: CategorizeIssueOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
