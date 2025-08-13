
'use server';
/**
 * @fileOverview A price estimation AI agent for SofaClean Pro.
 *
 * - estimatePrice - A function that handles the price estimation process.
 * - EstimatePriceInput - The input type for the estimatePrice function.
 * - EstimatePriceOutput - The return type for the estimatePrice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const EstimatePriceInputSchema = z.object({
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "An optional photo of the item to be cleaned, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().describe('The user\'s description of the item to be cleaned and the type of dirt/stains.'),
});
export type EstimatePriceInput = z.infer<typeof EstimatePriceInputSchema>;

const EstimatePriceOutputSchema = z.object({
    estimatedPrice: z.number().describe("The estimated price for the cleaning service in Thai Baht."),
    justification: z.string().describe("A brief justification for the estimated price, explaining the reasoning in Thai."),
    confidence: z.enum(["High", "Medium", "Low"]).describe("The confidence level of the estimation."),
});
export type EstimatePriceOutput = z.infer<typeof EstimatePriceOutputSchema>;


const prompt = ai.definePrompt({
    name: 'estimatePricePrompt',
    input: { schema: EstimatePriceInputSchema },
    output: { schema: EstimatePriceOutputSchema },
    prompt: `You are a price estimation expert for a cleaning service called "SofaClean Pro" in Thailand. Your task is to provide a price estimate in Thai Baht (THB) based on the user's description and an optional photo.

    Company's Standard Pricing (for reference):
    - Car seats (sedan): Starts at 990 THB
    - Car seats (SUV): Starts at 1,290 THB
    - Sofa (2-3 seats): Starts at 1,290 THB
    - Sofa (L-Shape): Starts at 1,590 THB
    - Mattresses (single/double): Starts at 1,500 THB
    - Carpets: Starts at 500 THB (depending on size)

    Factors to consider for pricing:
    1.  **Item Type & Size:** Is it a sofa, car seat, mattress, etc.? How big is it? (e.g., L-shape sofa costs more than a 2-seater).
    2.  **Material:** (if identifiable from photo or description) Leather, fabric, special materials.
    3.  **Severity of Stains/Dirt:** Are they simple dust, food spills, pet stains, heavy grease, or water damage? Severe stains require more work and increase the price.
    4.  **Special requests:** e.g., allergy-friendly cleaning, odor removal.

    Your task:
    1.  Analyze the user's description and the provided photo (if any).
    2.  Estimate a fair price in THB based on the factors above.
    3.  Provide a brief justification for your price in **Thai**. Explain *why* you arrived at that price (e.g., "ประเมินจากโซฟา L-Shape ขนาดใหญ่และมีคราบฝังลึก").
    4.  Set a confidence level for your estimation. If the description is vague or the photo is unclear, the confidence should be "Medium" or "Low". If the details are very clear, it can be "High".

    User's request:
    Description: {{{description}}}
    {{#if photoDataUri}}
    Photo: {{media url=photoDataUri}}
    {{/if}}
    `,
});

const estimatePriceFlow = ai.defineFlow(
    {
      name: 'estimatePriceFlow',
      inputSchema: EstimatePriceInputSchema,
      outputSchema: EstimatePriceOutputSchema,
    },
    async (input) => {
      const { output } = await prompt.generate({input});
      return output!;
    }
);

// Exported wrapper function
export async function estimatePrice(input: EstimatePriceInput): Promise<EstimatePriceOutput> {
    return estimatePriceFlow(input);
}
