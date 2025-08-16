"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc, orderBy, query, Timestamp, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Loader2, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

export interface Quote {
    id: string;
    name: string;
    phone: string;
    address: string;
    description: string;
    images: string[];
    createdAt: Timestamp;
    status: 'new' | 'contacted' | 'completed' | 'cancelled';
}

const statusMap: Record<Quote['status'], { text: string; className: string }> = {
    new: { text: "ใหม่", className: "bg-blue-500 hover:bg-blue-500" },
    contacted: { text: "ติดต่อแล้ว", className: "bg-yellow-500 hover:bg-yellow-500" },
    completed: { text: "สำเร็จ", className: "bg-green-500 hover:bg-green-500" },
    cancelled: { text: "ยกเลิก", className: "bg-gray-500 hover:bg-gray-500" },
};

export default function QuotesListPage() {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);
    const [galleryImages, setGalleryImages] = useState<string[]>([]);
    const [galleryIndex, setGalleryIndex] = useState(0);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const { toast } = useToast();

    const fetchQuotes = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "quotes"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const quotesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quote));
            setQuotes(quotesData);
        } catch (error) {
            console.error("Error fetching quotes: ", error);
            toast({
                variant: "destructive",
                title: "เกิดข้อผิดพลาด",
                description: "ไม่สามารถโหลดข้อมูลใบเสนอราคาได้",
            });
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchQuotes();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await deleteDoc(doc(db, "quotes", id));
            toast({
                title: "ลบสำเร็จ",
                description: "ใบเสนอราคาถูกลบเรียบร้อยแล้ว",
            });
            fetchQuotes(); // Refresh list after delete
        } catch (error) {
            console.error("Error deleting quote: ", error);
            toast({
                variant: "destructive",
                title: "เกิดข้อผิดพลาด",
                description: "ไม่สามารถลบใบเสนอราคาได้",
            });
        }
    };

    const handleStatusChange = async (quoteId: string, newStatus: Quote['status']) => {
        try {
            const quoteRef = doc(db, 'quotes', quoteId);
            await updateDoc(quoteRef, { status: newStatus });
            setQuotes(prevQuotes =>
                prevQuotes.map(q => (q.id === quoteId ? { ...q, status: newStatus } : q))
            );
            toast({
                title: "อัปเดตสถานะสำเร็จ",
                description: `สถานะของใบเสนอราคาถูกเปลี่ยนเป็น "${statusMap[newStatus].text}"`,
            });
        } catch (error) {
            console.error("Error updating status: ", error);
             toast({
                variant: "destructive",
                title: "เกิดข้อผิดพลาด",
                description: "ไม่สามารถอัปเดตสถานะได้",
            });
        }
    };
    
    const openGallery = (images: string[], index: number) => {
        setGalleryImages(images);
        setGalleryIndex(index);
        setIsGalleryOpen(true);
    };

    const closeGallery = () => {
        setIsGalleryOpen(false);
    };
    
    const nextImage = () => {
        setGalleryIndex((prevIndex) => (prevIndex + 1) % galleryImages.length);
    };

    const prevImage = () => {
        setGalleryIndex((prevIndex) => (prevIndex - 1 + galleryImages.length) % galleryImages.length);
    };


    const formatDate = (timestamp: Timestamp) => {
        if (!timestamp) return "ไม่มีข้อมูลวันที่";
        return new Date(timestamp.seconds * 1000).toLocaleString('th-TH', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit',
            hour12: false
        });
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-6xl mx-auto">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>รายการใบเสนอราคา</CardTitle>
                                    <CardDescription>จัดการคำขอใบเสนอราคาจากลูกค้า</CardDescription>
                                </div>
                                <Button variant="outline" asChild>
                                    <Link href="/admin/dashboard">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        กลับไปหน้า Dashboard
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="flex justify-center items-center py-10">
                                    <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                                    <span>กำลังโหลดข้อมูล...</span>
                                </div>
                            ) : quotes.length === 0 ? (
                                <div className="text-center py-10">
                                    <p className="text-muted-foreground">ยังไม่มีใบเสนอราคาเข้ามา</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {quotes.map((quote) => (
                                        <Card key={quote.id} className="overflow-hidden">
                                            <CardHeader className="bg-gray-100/80 p-4">
                                                 <div className="flex flex-wrap justify-between items-center gap-4">
                                                    <div>
                                                        <CardTitle className="text-lg">คุณ {quote.name}</CardTitle>
                                                        <CardDescription>
                                                            ส่งเมื่อ: {formatDate(quote.createdAt)}
                                                        </CardDescription>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                         <Badge className={statusMap[quote.status]?.className || ''}>
                                                            {statusMap[quote.status]?.text || quote.status}
                                                        </Badge>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="destructive" size="sm">ลบ</Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>คุณแน่ใจหรือไม่?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        การกระทำนี้ไม่สามารถย้อนกลับได้ ใบเสนอราคาจะถูกลบออกจากฐานข้อมูลอย่างถาวร
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => handleDelete(quote.id)}>ยืนยันการลบ</AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <h4 className="font-semibold mb-2">ข้อมูลติดต่อ</h4>
                                                    <p><strong className="font-medium">เบอร์โทร:</strong> {quote.phone}</p>
                                                    <p><strong className="font-medium">ที่อยู่:</strong> {quote.address || "ไม่ได้ระบุ"}</p>
                                                    <h4 className="font-semibold mt-4 mb-2">รายละเอียดงาน</h4>
                                                    <p className="whitespace-pre-wrap bg-gray-50 p-3 rounded-md">{quote.description}</p>
                                                     <div className="mt-4">
                                                        <Label>เปลี่ยนสถานะ</Label>
                                                        <Select
                                                            value={quote.status}
                                                            onValueChange={(value) => handleStatusChange(quote.id, value as Quote['status'])}
                                                        >
                                                            <SelectTrigger className="w-[180px]">
                                                                <SelectValue placeholder="เลือกสถานะ" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="new">ใหม่</SelectItem>
                                                                <SelectItem value="contacted">ติดต่อแล้ว</SelectItem>
                                                                <SelectItem value="completed">สำเร็จ</SelectItem>
                                                                <SelectItem value="cancelled">ยกเลิก</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold mb-2">รูปภาพที่แนบมา</h4>
                                                    {quote.images && quote.images.length > 0 ? (
                                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                            {quote.images.map((imgSrc, index) => (
                                                                <button key={index} onClick={() => openGallery(quote.images, index)} className="focus:outline-none">
                                                                    <Image
                                                                        src={imgSrc}
                                                                        alt={`รูปแนบ ${index + 1}`}
                                                                        width={200}
                                                                        height={200}
                                                                        className="rounded-md object-cover aspect-square hover:opacity-80 transition-opacity cursor-pointer"
                                                                    />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-muted-foreground text-sm">ไม่มีรูปภาพแนบ</p>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

             <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
                <DialogContent className="max-w-4xl p-2 bg-transparent border-0 shadow-none flex flex-col items-center justify-center">
                    <DialogHeader className="sr-only">
                        <DialogTitle>รูปภาพขนาดใหญ่</DialogTitle>
                        <DialogDescription>แสดงรูปภาพที่ลูกค้าแนบมาในใบเสนอราคา</DialogDescription>
                    </DialogHeader>
                    {galleryImages.length > 0 && (
                        <div className="relative w-full h-full">
                             <Image
                                src={galleryImages[galleryIndex]}
                                alt={`รูปภาพขนาดใหญ่ ${galleryIndex + 1}`}
                                width={1200}
                                height={800}
                                className="rounded-md object-contain max-h-[85vh] w-full"
                            />
                            {galleryImages.length > 1 && (
                                <>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full h-10 w-10 bg-black/50 hover:bg-black/70 border-none text-white"
                                        onClick={prevImage}
                                    >
                                        <ChevronLeft className="h-6 w-6" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-10 w-10 bg-black/50 hover:bg-black/70 border-none text-white"
                                        onClick={nextImage}
                                    >
                                        <ChevronRight className="h-6 w-6" />
                                    </Button>
                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm rounded-full px-3 py-1">
                                        {galleryIndex + 1} / {galleryImages.length}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
