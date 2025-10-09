'use server';
/**
 * @fileOverview This file defines a Genkit flow for enhancing voice print security using AI analysis.
 *
 * It includes functions and types for analyzing voice prints for anomalies and potential threats, such as voice cloning or mimicking.
 * The flow takes a voice print as input and returns a security assessment.
 *
 * - enhanceVoicePrintSecurity - A function that enhances voice print security by analyzing it for anomalies and potential threats.
 * - EnhanceVoicePrintSecurityInput - The input type for the enhanceVoicePrintSecurity function.
 * - EnhanceVoicePrintSecurityOutput - The return type for the enhanceVoicePrintSecurity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceVoicePrintSecurityInputSchema = z.object({
  voicePrintDataUri: z
    .string()
    .describe(
      'A voice print as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Ensure correct format and description
    ),
  userId: z.string().describe('The ID of the user associated with the voice print.'), // User identification for context
});

export type EnhanceVoicePrintSecurityInput = z.infer<typeof EnhanceVoicePrintSecurityInputSchema>;

const EnhanceVoicePrintSecurityOutputSchema = z.object({
  securityAssessment: z.object({
    isSecure: z.boolean().describe('Whether the voice print is currently considered secure.'),
    threatLevel: z
      .string()
      .describe(
        'An assessment of the threat level, e.g., \'low\', \'medium\', or \'high\'. Provide reasoning for the assigned threat level.'
      ),
    anomaliesDetected: z.array(z.string()).describe('A list of any anomalies detected in the voice print.'),
    recommendedActions: z
      .array(z.string())
      .describe('A list of recommended actions to enhance the security of the voice print.'),
  }),
});

export type EnhanceVoicePrintSecurityOutput = z.infer<typeof EnhanceVoicePrintSecurityOutputSchema>;

export async function enhanceVoicePrintSecurity(
  input: EnhanceVoicePrintSecurityInput
): Promise<EnhanceVoicePrintSecurityOutput> {
  return enhanceVoicePrintSecurityFlow(input);
}

const enhanceVoicePrintSecurityPrompt = ai.definePrompt({
  name: 'enhanceVoicePrintSecurityPrompt',
  input: {schema: EnhanceVoicePrintSecurityInputSchema},
  output: {schema: EnhanceVoicePrintSecurityOutputSchema},
  prompt: `You are an AI-powered security analyst specializing in voice biometrics.

You will analyze the provided voice print for anomalies, potential threats like voice cloning or mimicking, and overall security.

Based on your analysis, you will provide a security assessment, including the overall security status (isSecure), threat level, any detected anomalies, and recommended actions to enhance security.

Voice Print: {{media url=voicePrintDataUri}}
User ID: {{{userId}}}

Consider factors such as voice consistency, unusual patterns, and indicators of synthetic voice generation.

Format your response as a JSON object conforming to the following schema:
${JSON.stringify(EnhanceVoicePrintSecurityOutputSchema.shape, null, 2)}`,
});

const enhanceVoicePrintSecurityFlow = ai.defineFlow(
  {
    name: 'enhanceVoicePrintSecurityFlow',
    inputSchema: EnhanceVoicePrintSecurityInputSchema,
    outputSchema: EnhanceVoicePrintSecurityOutputSchema,
  },
  async input => {
    const {output} = await enhanceVoicePrintSecurityPrompt(input);
    return output!;
  }
);
