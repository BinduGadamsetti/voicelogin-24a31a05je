"use server";

import {
  enhanceVoicePrintSecurity,
  type EnhanceVoicePrintSecurityInput,
  type EnhanceVoicePrintSecurityOutput,
} from '@/ai/flows/enhance-voice-print-security';

export async function analyzeSecurity(
  input: EnhanceVoicePrintSecurityInput
): Promise<{ success: boolean; data?: EnhanceVoicePrintSecurityOutput; error?: string }> {
  try {
    const result = await enhanceVoicePrintSecurity(input);
    return { success: true, data: result };
  } catch (error) {
    console.error("AI security analysis failed:", error);
    // In a real app, you might want more sophisticated error handling
    if (error instanceof Error) {
        return { success: false, error: 'AI service is currently unavailable. Please try again later.' };
    }
    return { success: false, error: 'An unexpected error occurred during security analysis.' };
  }
}
