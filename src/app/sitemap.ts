// src/app/sitemap.ts
// ✅ ทำให้ Dynamic + ลดแคชลง (หรือใช้ force-dynamic ด้านล่าง)
export const revalidate = 60; // อัปเดตใหม่อย่างน้อยทุก ๆ 60 วินาที
export const dynamic = 'force-dynamic'; // บังคับรันฝั่งเซิร์ฟเวอร์ทุกครั้ง (กันเคส cache บนโฮสต์)

// ใช้ชนิดของ Next.js
import type { MetadataRoute } from 'next';

// ✅ แนะนำให้อ่านจาก env ก่อน แล้วค่อย fallback ไป header/ค่าพื้นฐาน
// ใส่ NEXT_PUBLIC_SITE_URL ใน Vercel: https://sofaclean-pro-v2.vercel.app
function getBaseUrl(): string {
  // 1) ใช้ค่า config ที่คุมได้ก่อน
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '');
  if (fromEnv) return fromEnv;

  // 2) fallback เผื่อเรียกตอน build
  return 'https://sofaclean-pro-v2.vercel.app';
}

const base = getBaseUrl();

// ✅ ดึงโพสต์จาก Firestore ให้เป็นปัจจุบัน
// หมายเหตุ: ใช้โมดูลเดียวกับฝั่งเซิร์ฟเวอร์ของคุณ
// ถ้าโปรเจกต์คุณตั้งค่า '@/lib/firebase' ให้ใช้ Web SDK ฝั่งเซิร์ฟเวอร์ได้ ให้ import ได้เลย
import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore';

type PostDoc = {
  slug: string;
  lang?: 'en' | 'th';
  date?: string | number; // ISO หรือ timestamp
  updatedAt?: string | number;
  status?: 'published' | 'draft';
};

// แปลงอะไรก็ได้ให้เป็น Date ที่ถูกต้อง
function asDate(d?: string | number): Date {
  if (!d) return new Date();
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? new Date() : dt;
}

// encode URI รองรับ slug ภาษาไทย/ช่องว่าง
const safe = (s: string) => encodeURI(s);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ====== Static ส่วนที่ไม่เปลี่ยนบ่อย ======
  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${base}/`,        changeFrequency: 'daily',  priority: 1.0, lastModified: new Date() },
    { url: `${base}/en`,      changeFrequency: 'daily',  priority: 1.0, lastModified: new Date() },
    { url: `${base}/en/blog`, changeFrequency: 'weekly', priority: 0.9, lastModified: new Date() },
    { url: `${base}/th`,      changeFrequency: 'daily',  priority: 1.0, lastModified: new Date() },
    { url: `${base}/th/blog`, changeFrequency: 'weekly', priority: 0.9, lastModified: new Date() },
  ];

  // ====== Dynamic Posts จาก Firestore ======
  // ปรับชื่อคอลเลกชัน/ฟิลด์ตามของคุณ เช่น "posts"
  // เงื่อนไขทั่วไป:
  // - status == 'published'
  // - sort ตาม updatedAt หรือ date เพื่อลดโอกาสดึงค่าผิดลำดับ
  const postsRef = collection(db, 'posts');
  const q = query(
    postsRef,
    where('status', '==', 'published'),
    // ถ้าไม่มี updatedAt ให้ใช้ orderBy('date', 'desc') หรือถ้าไม่มีเลย ตัดบรรทัดนี้ออก
    orderBy('updatedAt', 'desc')
  );

  const snap = await getDocs(q);

  const postEntries: MetadataRoute.Sitemap = snap.docs.map((doc) => {
    const data = doc.data() as PostDoc;

    // รองรับทั้ง en/th ถ้าคุณเก็บรวมกันในคอลเลกชันเดียว
    // ถ้าคุณแยกคอลเลกชันต่อภาษา ให้แก้เส้นทางให้เหมาะสม
    const lang = data.lang === 'th' ? 'th' : 'en';

    // เลือกฟิลด์วันที่ที่ “อัปเดตล่าสุด” จริง
    const last = asDate(data.updatedAt ?? data.date ?? Date.now());

    return {
      url: `${base}/${lang}/blog/${safe(data.slug)}`,
      lastModified: last,
      changeFrequency: 'monthly',
      priority: 0.8,
    };
  });

  // รวมทั้งหมดและส่งออก
  return [...staticUrls, ...postEntries];
}
