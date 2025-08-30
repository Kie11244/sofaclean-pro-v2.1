// src/app/sitemap.ts
// ✅ Dynamic sitemap + กัน cache ดื้อ ๆ + มี fallback ถ้า Firestore ดึงไม่ได้
export const revalidate = 60;             // อัปเดตอย่างน้อยทุก 60 วินาที
export const dynamic = 'force-dynamic';   // บังคับรันฝั่งเซิร์ฟเวอร์ทุกครั้ง

import type { MetadataRoute } from 'next';

// ===== Base URL =====
function getBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '');
  if (fromEnv) return fromEnv;
  return 'https://sofaclean-pro-v2.vercel.app';
}
const base = getBaseUrl();

// ===== Firestore (ปรับ path ให้ตรงโปรเจกต์คุณ) =====
import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore';

// ===== Types & utils =====
type PostDoc = {
  slug: string;
  lang?: 'en' | 'th';
  date?: string | number;     // ISO หรือ timestamp
  updatedAt?: string | number;
  status?: 'published' | 'draft';
};

function asDate(d?: string | number): Date {
  if (!d) return new Date();
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? new Date() : dt;
}

const safe = (s: string) => encodeURI(s);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ----- URLs ที่คงที่ -----
  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${base}/`,        changeFrequency: 'daily',  priority: 1.0, lastModified: new Date() },
    { url: `${base}/en`,      changeFrequency: 'daily',  priority: 1.0, lastModified: new Date() },
    { url: `${base}/en/blog`, changeFrequency: 'weekly', priority: 0.9, lastModified: new Date() },
    { url: `${base}/th`,      changeFrequency: 'daily',  priority: 1.0, lastModified: new Date() },
    { url: `${base}/th/blog`, changeFrequency: 'weekly', priority: 0.9, lastModified: new Date() },
  ];

  // ----- ดึงโพสต์จาก Firestore (มี try/catch กันพัง) -----
  try {
    const postsRef = collection(db, 'posts'); // เปลี่ยนชื่อคอลเลกชันได้ถ้าคุณใช้ชื่ออื่น
    // ถ้าไม่มีฟิลด์ updatedAt ให้เปลี่ยนเป็น orderBy('date', 'desc') หรือเอา orderBy ออก
    const q = query(
      postsRef,
      where('status', '==', 'published'),
      orderBy('updatedAt', 'desc')
    );

    const snap = await getDocs(q);

    const postEntries: MetadataRoute.Sitemap = snap.docs.map((doc) => {
      const data = doc.data() as PostDoc;
      const lang = data.lang === 'th' ? 'th' : 'en';
      const last = asDate(data.updatedAt ?? data.date ?? Date.now());

      return {
        url: `${base}/${lang}/blog/${safe(data.slug)}`,
        lastModified: last,
        changeFrequency: 'monthly',
        priority: 0.8,
      };
    });

    return [...staticUrls, ...postEntries];
  } catch (e) {
    // Fallback: ถ้า Firestore ล่ม/ตั้งค่าไม่ครบ จะยังมี sitemap ใช้งานได้
    // (คุณสามารถเติมโพสต์ static ชั่วคราวไว้ได้ที่นี่ถ้าต้องการ)
    return [...staticUrls];
  }
}
