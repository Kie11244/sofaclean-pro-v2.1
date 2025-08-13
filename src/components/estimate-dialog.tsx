
"use client";

import { useState, useRef, ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, Upload } from 'lucide-react';
import { estimatePrice, EstimatePriceOutput } from '@/ai/flows/estimate-price-flow';
import Image from 'next/image';

interface EstimateDialogProps {
    children: React.ReactNode;
}

export function EstimateDialog({ children }: EstimateDialogProps) {
    const [description, setDescription] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageDataUri, setImageDataUri] = useState<string | null>(null);
    const [isLoading, setIsLoading] =useState(false);
    const [result, setResult] = useState<EstimatePriceOutput | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 4 * 1024 * 1024) { // 4MB limit
                toast({
                    variant: "destructive",
                    title: "รูปภาพมีขนาดใหญ่เกินไป",
                    description: "กรุณาเลือกรูปภาพที่มีขนาดไม่เกิน 4MB",
                });
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                const dataUri = reader.result as string;
                setImagePreview(URL.createObjectURL(file));
                setImageDataUri(dataUri);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFormSubmit = async () => {
        if (!description.trim()) {
            toast({
                variant: "destructive",
                title: "กรุณากรอกรายละเอียด",
                description: "โปรดอธิบายเกี่ยวกับโซฟาหรือพรมที่ต้องการให้ทำความสะอาด",
            });
            return;
        }

        setIsLoading(true);
        setResult(null);

        try {
            const response = await estimatePrice({
                description,
                photoDataUri: imageDataUri || undefined,
            });
            setResult(response);
        } catch (error) {
            console.error("Error estimating price:", error);
            toast({
                variant: "destructive",
                title: "เกิดข้อผิดพลาด",
                description: "ไม่สามารถประเมินราคาได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const resetDialog = () => {
        setDescription("");
        setImagePreview(null);
        setImageDataUri(null);
        setResult(null);
        setIsLoading(false);
    };

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
           // Reset state after closing animation
           setTimeout(() => {
                resetDialog();
           }, 300);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="text-primary" />
                        ประเมินราคาด้วย AI อัจฉริยะ
                    </DialogTitle>
                    <DialogDescription>
                        เพียงกรอกรายละเอียดและแนบรูป (ถ้ามี) ระบบ AI ของเราจะประเมินราคาเบื้องต้นให้ทันที
                    </DialogDescription>
                </DialogHeader>

                {!result && (
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="description">
                                รายละเอียด <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="เช่น โซฟาผ้า 3 ที่นั่ง มีรอยคราบกาแฟและฝุ่นสะสม"
                                rows={3}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="picture">รูปภาพ (ถ้ามี)</Label>
                            <Input
                                id="picture"
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                className="hidden"
                                accept="image/png, image/jpeg, image/webp"
                                disabled={isLoading}
                            />
                            <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
                                <Upload className="mr-2 h-4 w-4" />
                                {imagePreview ? "เปลี่ยนรูปภาพ" : "เลือกรูปภาพ"}
                            </Button>
                        </div>
                        {imagePreview && (
                            <div className="relative w-full aspect-video rounded-md overflow-hidden border">
                                <Image src={imagePreview} alt="Preview" layout="fill" objectFit="contain" />
                            </div>
                        )}
                    </div>
                )}
                
                {isLoading && (
                    <div className="flex flex-col items-center justify-center gap-4 py-8">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        <p className="text-muted-foreground">AI กำลังประเมินราคา... โปรดรอสักครู่</p>
                    </div>
                )}

                {result && !isLoading && (
                    <div className="py-4 text-center">
                         <p className="text-muted-foreground">ราคาประเมินเบื้องต้น</p>
                         <p className="text-5xl font-bold text-primary my-2">
                            {result.estimatedPrice.toLocaleString()} ฿
                         </p>
                         <p className="text-sm text-muted-foreground italic mb-4">
                            "{result.justification}"
                         </p>
                         <div className="text-xs text-muted-foreground">
                            ระดับความมั่นใจ: {result.confidence}
                         </div>
                         <p className="text-xs text-muted-foreground mt-4">
                            *ราคานี้เป็นการประเมินจาก AI เบื้องต้น ราคาจริงอาจเปลี่ยนแปลงได้หลังจากการตรวจสอบหน้างาน
                         </p>
                    </div>
                )}

                <DialogFooter>
                    {result ? (
                        <DialogClose asChild>
                            <Button type="button" className="w-full">ปิดหน้าต่าง</Button>
                        </DialogClose>
                    ) : (
                         <Button type="submit" onClick={handleFormSubmit} disabled={isLoading} className="w-full">
                            {isLoading ? 'กำลังประเมิน...' : 'ส่งประเมินราคา'}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

