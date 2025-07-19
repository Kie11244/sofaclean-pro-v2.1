"use client";

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Sparkles, Loader2 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { getAiQuote } from '@/app/actions';
import { useToast } from "@/hooks/use-toast";
import { dictionaries } from '@/lib/client-dictionaries';
import type { Locale } from '@/i18n.config';

function SubmitButton({ text, pendingText }: { text: string; pendingText: string }) {
    const { pending } = useFormStatus();
    return (
        <Button
            type="submit"
            disabled={pending}
            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 text-base"
        >
            {pending ? <Loader2 className="animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {pending ? pendingText : text}
        </Button>
    );
}

export function PriceEstimator({ locale }: { locale: Locale }) {
    const [dict, setDict] = useState(() => dictionaries[locale].sync());

    const initialState = { message: '', errors: null, data: null };
    const [state, dispatch] = useActionState(getAiQuote, initialState);
    const formRef = useRef<HTMLFormElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (state.message === 'Success' && state.data) {
            formRef.current?.reset();
        }
        if (state.message === 'Error' && state.errors?._server) {
             toast({
                title: dict.priceEstimator.error.title,
                description: state.errors._server[0],
                variant: "destructive",
            });
        }
    }, [state, toast, dict]);


    useEffect(() => {
        setDict(dictionaries[locale].sync());
    }, [locale]);


    return (
        <section id="ai-quoter" className="bg-indigo-50 p-4 md:p-12 rounded-2xl shadow-inner">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-indigo-800">
                <Sparkles className="inline-block w-8 h-8 mr-2 -mt-1" />
                {dict.priceEstimator.title}
            </h2>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
                {dict.priceEstimator.description}
            </p>
            <div className="max-w-2xl mx-auto">
                <Card className="p-6 rounded-xl shadow-lg">
                    <form ref={formRef} action={dispatch}>
                        <label htmlFor="details" className="block text-gray-700 font-semibold mb-2">{dict.priceEstimator.form.label}</label>
                        <Textarea
                            id="details"
                            name="details"
                            rows={4}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                            placeholder={dict.priceEstimator.form.placeholder}
                        />
                         {state?.errors?.details && <p className="text-sm font-medium text-destructive mt-2">{state.errors.details[0]}</p>}
                        <SubmitButton text={dict.priceEstimator.form.button} pendingText={dict.priceEstimator.form.buttonPending} />
                    </form>
                </Card>

                {state.data && state.message === 'Success' && (
                    <Card className="mt-6 p-6 rounded-xl shadow-lg animate-in fade-in-50">
                        <CardHeader className="p-0 mb-2">
                            <CardTitle className="text-lg text-indigo-700">{dict.priceEstimator.results.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 text-gray-700 prose prose-sm max-w-none">
                            <p><strong>{dict.priceEstimator.results.price}:</strong> {state.data.priceRange}</p>
                            <p><strong>{dict.priceEstimator.results.package}:</strong> {state.data.recommendedPackage}</p>
                            <p><strong>{dict.priceEstimator.results.reason}:</strong> {state.data.reason}</p>
                            <p className="mt-4">{state.data.closing}</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </section>
    );
}
