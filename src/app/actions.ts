"use server";

import { estimateCleaningPrice } from '@/ai/flows/estimate-cleaning-price';
import { z } from 'zod';

const schema = z.object({
  details: z.string({
      required_error: "กรุณาป้อนรายละเอียด",
      invalid_type_error: "ข้อมูลไม่ถูกต้อง",
    })
    .min(10, { message: 'กรุณาป้อนรายละเอียดอย่างน้อย 10 ตัวอักษร' })
    .max(500, { message: 'รายละเอียดต้องไม่เกิน 500 ตัวอักษร' }),
});

type State = {
    message: string;
    errors: {
        details?: string[];
        _server?: string[];
    } | null;
    data: {
        priceRange: string;
        recommendedPackage: string;
        reason: string;
        closing: string;
    } | null;
}

export async function getAiQuote(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = schema.safeParse({
    details: formData.get('details'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Error',
      errors: validatedFields.error.flatten().fieldErrors,
      data: null,
    };
  }

  try {
    const result = await estimateCleaningPrice({ details: validatedFields.data.details });
    return { message: 'Success', errors: null, data: result };
  } catch (error) {
    console.error("AI Estimation Error:", error);
    return { message: 'Error', errors: { _server: ['ขออภัยค่ะ เกิดข้อผิดพลาดในการติดต่อ AI กรุณาลองใหม่อีกครั้ง หรือติดต่อเราโดยตรงผ่านไลน์หรือเบอร์โทรศัพท์ได้เลยค่ะ'] }, data: null };
  }
}
