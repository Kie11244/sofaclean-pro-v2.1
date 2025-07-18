"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useRef } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { getAiQuote } from '@/app/actions';
import { useToast } from "@/hooks/use-toast";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button
            type="submit"
            disabled={pending}
            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 text-base"
        >
            {pending ? <Loader2 className="animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {pending ? "กำลังประเมิน..." : "ประเมินราคาด้วย AI"}
        </Button>
    );
}

export function PriceEstimator() {
    const initialState = { message: '', errors: null, data: null };
    const [state, dispatch] = useFormState(getAiQuote, initialState);
    const formRef = useRef<HTMLFormElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (state.message === 'Success' && state.data) {
            formRef.current?.reset();
        }
        if (state.message === 'Error' && state.errors?._server) {
             toast({
                title: "เกิดข้อผิดพลาด",
                description: state.errors._server[0],
                variant: "destructive",
            });
        }
    }, [state, toast]);


    return (
        <section id="ai-quoter" className="bg-indigo-50 p-4 md:p-12 rounded-2xl shadow-inner">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-indigo-800">
                <Sparkles className="inline-block w-8 h-8 mr-2 -mt-1" />
                ประเมินราคาซักโซฟาด่วนด้วย AI
            </h2>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
                อยากทราบราคาซักโซฟาทันที? บอกรายละเอียดของโซฟาหรือเบาะรถของคุณ แล้วให้ AI ช่วยประเมินราคาเบื้องต้นได้เลย!
            </p>
            <div className="max-w-2xl mx-auto">
                <Card className="p-6 rounded-xl shadow-lg">
                    <form ref={formRef} action={dispatch}>
                        <label htmlFor="details" className="block text-gray-700 font-semibold mb-2">ระบุรายละเอียดที่ต้องการทำความสะอาด:</label>
                        <Textarea
                            id="details"
                            name="details"
                            rows={4}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                            placeholder="เช่น โซฟา L-shape ผ้าสีครีม มีรอยคราบอาหาร, เบาะรถยนต์ Honda Civic ทั้งหมด 4 ที่นั่ง..."
                        />
                         {state?.errors?.details && <p className="text-sm font-medium text-destructive mt-2">{state.errors.details[0]}</p>}
                        <SubmitButton />
                    </form>
                </Card>

                {state.data && state.message === 'Success' && (
                    <Card className="mt-6 p-6 rounded-xl shadow-lg animate-in fade-in-50">
                        <CardHeader className="p-0 mb-2">
                            <CardTitle className="text-lg text-indigo-700">ใบเสนอราคาเบื้องต้นจาก AI:</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 text-gray-700 prose prose-sm max-w-none">
                            <p><strong>ราคาประเมิน:</strong> {state.data.priceRange}</p>
                            <p><strong>แพ็กเกจที่แนะนำ:</strong> {state.data.recommendedPackage}</p>
                            <p><strong>เหตุผล:</strong> {state.data.reason}</p>
                            <p className="mt-4">{state.data.closing}</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </section>
    );
}
