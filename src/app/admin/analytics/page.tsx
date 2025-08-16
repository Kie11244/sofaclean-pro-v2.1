"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, Timestamp, query, where } from 'firebase/firestore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText, Newspaper, Loader2, ArrowLeft } from 'lucide-react';
import { subDays, format, startOfDay } from 'date-fns';
import { th } from 'date-fns/locale';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Quote {
    id: string;
    createdAt: Timestamp;
}

interface Post {
    id: string;
}

interface ChartData {
    name: string;
    quotes: number;
}

export default function AnalyticsPage() {
    const [quoteCount, setQuoteCount] = useState(0);
    const [postCount, setPostCount] = useState(0);
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch total quotes and posts
                const quotesSnapshot = await getDocs(collection(db, 'quotes'));
                const postsSnapshot = await getDocs(collection(db, 'posts'));
                setQuoteCount(quotesSnapshot.size);
                setPostCount(postsSnapshot.size);

                // Fetch quotes for the last 7 days
                const last7Days = startOfDay(subDays(new Date(), 6));
                const q = query(collection(db, 'quotes'), where('createdAt', '>=', last7Days));
                const recentQuotesSnapshot = await getDocs(q);
                const recentQuotes = recentQuotesSnapshot.docs.map(doc => doc.data() as { createdAt: Timestamp });

                // Process data for the chart
                const data: ChartData[] = [];
                for (let i = 6; i >= 0; i--) {
                    const date = subDays(new Date(), i);
                    data.push({
                        name: format(date, 'd MMM', { locale: th }),
                        quotes: 0,
                    });
                }
                
                recentQuotes.forEach(quote => {
                    const dateStr = format(quote.createdAt.toDate(), 'd MMM', { locale: th });
                    const dayData = data.find(d => d.name === dateStr);
                    if (dayData) {
                        dayData.quotes += 1;
                    }
                });

                setChartData(data);
            } catch (error) {
                console.error("Error fetching analytics data: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
             <div className="flex justify-center items-center h-screen">
                 <Loader2 className="mr-2 h-16 w-16 animate-spin" />
                 <span className="text-xl">กำลังโหลดข้อมูล...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                 <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
                        <p className="text-muted-foreground">ภาพรวมสถิติของเว็บไซต์คุณ</p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/admin/dashboard">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            กลับไปหน้า Dashboard
                        </Link>
                    </Button>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">ใบเสนอราคาทั้งหมด</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{quoteCount}</div>
                            <p className="text-xs text-muted-foreground">จำนวนใบเสนอราคาที่ส่งเข้ามาทั้งหมด</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">บทความทั้งหมด</CardTitle>
                            <Newspaper className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{postCount}</div>
                            <p className="text-xs text-muted-foreground">จำนวนบทความในบล็อกทั้งหมด</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>ใบเสนอราคาใน 7 วันล่าสุด</CardTitle>
                        <CardDescription>กราฟแสดงจำนวนใบเสนอราคาที่ส่งเข้ามาในแต่ละวัน</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                                <YAxis stroke="#888888" fontSize={12} allowDecimals={false} />
                                <Tooltip
                                     contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #ccc',
                                        borderRadius: '0.5rem',
                                    }}
                                    labelStyle={{ fontWeight: 'bold' }}
                                />
                                <Legend />
                                <Bar dataKey="quotes" fill="hsl(var(--primary))" name="ใบเสนอราคา" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
