'use server';
/**
 * @fileOverview AI flow to generate a professional subtitle for a developer.
 *
 * - generateProfessionalSubtitle - A function that generates a subtitle based on skills.
 * - GenerateSubtitleInput - The input type for the flow.
 * - GenerateSubtitleOutput - The return type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSubtitleInputSchema = z.object({
  skills: z.array(z.string()).describe('A list of key technical skills the developer possesses.'),
  currentTitle: z.string().optional().describe('The developer\'s current main title, e.g., "Full Stack Developer".')
});
export type GenerateSubtitleInput = z.infer<typeof GenerateSubtitleInputSchema>;

const GenerateSubtitleOutputSchema = z.object({
  subtitle: z.string().describe('A concise and impactful professional subtitle.'),
});
export type GenerateSubtitleOutput = z.infer<typeof GenerateSubtitleOutputSchema>;

export async function generateProfessionalSubtitle(input: GenerateSubtitleInput): Promise<GenerateSubtitleOutput> {
  return subtitleGenerationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSubtitlePrompt',
  input: {schema: GenerateSubtitleInputSchema},
  output: {schema: GenerateSubtitleOutputSchema},
  prompt: `You are an expert copywriter specializing in creating compelling professional subtitles for developers.
Given the developer's skills{{#if currentTitle}} and their current title of "{{currentTitle}}"{{/if}}, generate a concise, modern, and impactful subtitle.
The subtitle should highlight their expertise and passion for creating high-quality web applications.
Focus on a key theme or area of expertise implied by the skills. Avoid just listing skills.

Skills:
{{#each skills}}
- {{{this}}}
{{/each}}

Examples of good subtitles:
- "Crafting seamless digital experiences with modern frontend technologies."
- "Building robust and scalable full-stack solutions for the modern web."
- "Specializing in performant Next.js applications and cloud-native backends."

Generate one subtitle.`,
});

const subtitleGenerationFlow = ai.defineFlow(
  {
    name: 'subtitleGenerationFlow',
    inputSchema: GenerateSubtitleInputSchema,
    outputSchema: GenerateSubtitleOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('AI failed to generate a subtitle.');
    }
    return output;
  }
);
