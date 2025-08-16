"use client";

import { useState } from 'react';
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
import { MapPin, Loader2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc } from "firebase/firestore";


interface EstimateDialogProps {
    children: React.ReactNode;
}

export function EstimateDialog({ children }: EstimateDialogProps) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { toast } = useToast();
    
    const handleFetchLocation = () => {
        if (!navigator.geolocation) {
            toast({
                variant: "destructive",
                title: "ไม่รองรับ Geolocation",
                description: "เบราว์เซอร์ของคุณไม่รองรับการใช้งานนี้",
            });
            return;
        }

        setIsFetchingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
                    const data = await response.json();
                    if (data && data.display_name) {
                        setAddress(data.display_name);
                    } else {
                         throw new Error("Could not fetch address");
                    }
                } catch (error) {
                     toast({
                        variant: "destructive",
                        title: "ไม่สามารถดึงที่อยู่ได้",
                        description: "กรุณาลองอีกครั้งหรือพิมพ์ด้วยตนเอง",
                    });
                    setAddress(`Lat: ${latitude}, Lon: ${longitude}`);
                } finally {
                    setIsFetchingLocation(false);
                }
            },
            (error) => {
                toast({
                    variant: "destructive",
                    title: "ไม่สามารถเข้าถึงตำแหน่งได้",
                    description: "กรุณาอนุญาตการเข้าถึงตำแหน่งในเบราว์เซอร์ของคุณ",
                });
                setIsFetchingLocation(false);
            }
        );
    };


    const handleFormSubmit = async () => {
        if (!name.trim() || !phone.trim() || !description.trim()) {
            toast({
                variant: "destructive",
                title: "ข้อมูลไม่ครบถ้วน",
                description: "กรุณากรอกชื่อ, เบอร์โทรศัพท์, และรายละเอียดงาน",
            });
            return;
        }

        setIsSubmitting(true);
        
        try {
            await addDoc(collection(db, "quotes"), {
                name,
                phone,
                address,
                description,
                createdAt: new Date(),
                status: "new",
            });
            
            toast({
                title: "ส่งข้อมูลสำเร็จ",
                description: "เราได้รับข้อมูลของคุณแล้ว และจะติดต่อกลับโดยเร็วที่สุด",
            });

            handleOpenChange(false);

        } catch (error: any) {
             console.error("Error submitting quote:", error);
             toast({
                variant: "destructive",
                title: "เกิดข้อผิดพลาดในการส่งข้อมูล",
                description: error.message || "ไม่สามารถส่งข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetDialog = () => {
        setName("");
        setPhone("");
        setAddress("");
        setDescription("");
        setIsFetchingLocation(false);
        setIsSubmitting(false);
    };

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
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
            <DialogContent className="sm:max-w-lg bg-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl">
                        ขอใบเสนอราคา
                    </DialogTitle>
                    <DialogDescription>
                        กรุณากรอกข้อมูลด้านล่างให้ครบถ้วน เราจะติดต่อกลับเพื่อประเมินราคาให้คุณโดยเร็วที่สุด
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">ชื่อ-นามสกุล <span className="text-red-500">*</span></Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="เช่น สมชาย ใจดี" />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="phone">เบอร์โทรศัพท์ <span className="text-red-500">*</span></Label>
                        <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="เช่น 0812345678" />
                    </div>
                     <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                             <Label htmlFor="address">ที่อยู่ (ถ้ามี)</Label>
                             <Button variant="ghost" size="sm" onClick={handleFetchLocation} disabled={isFetchingLocation}>
                                {isFetchingLocation ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <MapPin className="mr-2 h-4 w-4" />
                                )}
                                 ใช้ที่อยู่ปัจจุบัน
                             </Button>
                        </div>
                        <Textarea 
                            id="address" 
                            value={address} 
                            onChange={(e) => setAddress(e.target.value)} 
                            placeholder={isFetchingLocation ? "กำลังดึงตำแหน่งปัจจุบัน..." : "ที่อยู่สำหรับเข้ารับบริการ"} 
                            rows={2}
                            disabled={isFetchingLocation}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">รายละเอียดงาน <span className="text-red-500">*</span></Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="เช่น โซฟาผ้า 3 ที่นั่ง มีรอยคราบกาแฟและฝุ่นสะสม"
                            rows={3}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline" disabled={isSubmitting}>ยกเลิก</Button>
                    </DialogClose>
                    <Button type="submit" onClick={handleFormSubmit} disabled={isSubmitting}>
                        {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> กำลังส่งข้อมูล...</> : 'ส่งข้อมูลเพื่อขอใบเสนอราคา'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
