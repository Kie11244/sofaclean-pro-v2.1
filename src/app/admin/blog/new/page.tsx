"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";

export default function NewBlogPostPage() {
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [image, setImage] = useState('');
    const [imageHint, setImageHint] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    
    const router = useRouter();
    const { toast } = useToast();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!title || !slug || !content || !description || !category) {
            toast({
                variant: "destructive",
                title: "ข้อมูลไม่ครบถ้วน",
                description: "กรุณากรอกข้อมูลที่จำเป็นให้ครบ",
            });
            return;
        }
        setLoading(true);
        try {
            const docRef = await addDoc(collection(db, "posts"), {
                title,
                slug,
                image: image || "https://placehold.co/800x400.png",
                imageHint,
                date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
                category,
                description,
                content,
            });
            toast({
                title: "สร้างบทความสำเร็จ",
                description: "บทความของคุณถูกบันทึกเรียบร้อยแล้ว",
            });
            router.push("/admin/blog");
        } catch (error) {
            console.error("Error adding document: ", error);
            toast({
                variant: "destructive",
                title: "เกิดข้อผิดพลาด",
                description: "ไม่สามารถสร้างบทความได้",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        // Auto-generate slug from title
        const newSlug = newTitle.toString().toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\u0E00-\u0E7F\w\-]+/g, '') // Remove all non-word chars except Thai
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');            // Trim - from end of text
        setSlug(newSlug);
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>สร้างบทความใหม่</CardTitle>
                        <CardDescription>กรอกรายละเอียดด้านล่างเพื่อสร้างบทความใหม่ในบล็อกของคุณ</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">หัวข้อเรื่อง *</Label>
                                <Input id="title" value={title} onChange={handleTitleChange} placeholder="หัวข้อของบทความ" required/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug (สำหรับ URL) *</Label>
                                <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="example-slug-for-url" required/>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="category">หมวดหมู่ *</Label>
                                <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="เช่น เคล็ดลับทำความสะอาด" required/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">คำอธิบายสั้นๆ *</Label>
                                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="คำอธิบายสั้นๆ ที่จะแสดงในหน้ารวมบทความ" required/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="content">เนื้อหาบทความ (HTML) *</Label>
                                <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="เนื้อหาของบทความ สามารถใช้แท็ก HTML ได้" rows={15} required/>
                                <p className="text-sm text-muted-foreground">คุณสามารถใช้แท็ก HTML เช่น &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt; ในการจัดรูปแบบ</p>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="image">URL รูปภาพหลัก</Label>
                                <Input id="image" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://example.com/image.png" />
                                <p className="text-sm text-muted-foreground">หากเว้นว่างไว้ จะใช้รูปภาพ placeholder</p>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="imageHint">คำใบ้รูปภาพ (สำหรับ AI)</Label>
                                <Input id="imageHint" value={imageHint} onChange={(e) => setImageHint(e.target.value)} placeholder="เช่น sofa living room" />
                            </div>
                            <div className="flex justify-end gap-4">
                                <Button variant="outline" type="button" onClick={() => router.back()}>
                                    ยกเลิก
                                </Button>
                                <Button type="submit" disabled={loading}>
                                    {loading ? 'กำลังบันทึก...' : 'บันทึกบทความ'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
