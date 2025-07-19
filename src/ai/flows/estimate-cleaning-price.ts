'use server';

/**
 * @fileOverview This file defines a Genkit flow for estimating the cleaning price of sofas, car upholstery, or curtains based on user input.
 *
 * - estimateCleaningPrice - A function that takes user input describing the cleaning requirements and returns an estimated price range.
 * - EstimateCleaningPriceInput - The input type for the estimateCleaningPrice function.
 * - EstimateCleaningPriceOutput - The return type for the estimateCleaningPrice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EstimateCleaningPriceInputSchema = z.object({
  details: z
    .string()
    .describe(
      'Details about the item to be cleaned, including type (sofa, car upholstery, curtains), material, size, and soiling description.'
    ),
});
export type EstimateCleaningPriceInput = z.infer<typeof EstimateCleaningPriceInputSchema>;

const EstimateCleaningPriceOutputSchema = z.object({
  priceRange: z.string().describe('An estimated price range for the cleaning service.'),
  recommendedPackage: z.string().describe('A recommended cleaning service package.'),
  reason: z.string().describe('A brief reason for recommending the specific package.'),
  closing: z.string().describe('A closing statement inviting the customer to contact for a precise quote.'),
});
export type EstimateCleaningPriceOutput = z.infer<typeof EstimateCleaningPriceOutputSchema>;

export async function estimateCleaningPrice(input: EstimateCleaningPriceInput): Promise<EstimateCleaningPriceOutput> {
  return estimateCleaningPriceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'estimateCleaningPricePrompt',
  input: {schema: EstimateCleaningPriceInputSchema},
  output: {schema: EstimateCleaningPriceOutputSchema},
  prompt: `คุณคือพนักงานขายของบริการทำความสะอาดชื่อ \"Clean & Care Pro\" ในประเทศไทย
  ลูกค้าต้องการให้ประเมินราคาสำหรับงานต่อไปนี้: \"{{{details}}}\".
  ให้วิเคราะห์คำขอของลูกค้าโดยอ้างอิงจากราคาเริ่มต้นของเรา (ซักเบาะรถยนต์เริ่ม 990 บาท, ซักโซฟาเริ่ม 1,290 บาท, ซักม่านเริ่ม 800 บาท) และสร้างคำตอบเป็นภาษาไทยที่สุภาพและเป็นมิตร โดยต้องมี:
  1. ราคาประเมิน **ที่เป็นช่วงราคา** (เช่น 1,290 - 1,590 บาท)
  2. แพ็กเกจบริการที่แนะนำ
  3. เหตุผลสั้นๆ ว่าทำไมถึงแนะนำแพ็กเกจนั้น
  4. ปิดท้ายด้วยการเชิญชวนให้ลูกค้าถ่ายรูปส่งมาทาง LINE หรือโทรมาเพื่อรับราคาที่แน่นอนและทำการจอง`,
});

const estimateCleaningPriceFlow = ai.defineFlow(
  {
    name: 'estimateCleaningPriceFlow',
    inputSchema: EstimateCleaningPriceInputSchema,
    outputSchema: EstimateCleaningPriceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
