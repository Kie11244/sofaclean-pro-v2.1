// src/app/sitemap.ts
// ✅ Dynamic sitemap + ลด cache + ใช้ฟิลด์ `date`
export const revalidate = 60;             // อัปเดตอย่างน้อยทุก 60 วิ
export const dynamic = 'force-dynamic';   // รันฝั่งเซิร์ฟเวอร์ทุกครั้ง

import type { MetadataRoute } from 'next';

// ----- Base URL -----
function getBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '');
  if (fromEnv) return fromEnv;
  return 'https://sofaclean-pro-v2.vercel.app';
}
const base = getBaseUrl();

// ----- Firestore -----
import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore';

// ----- Types & utils -----
type PostDoc = {
  slug: string;
  lang?: 'en' | 'th';
  date?: string | number;     // ใช้ฟิลด์นี้ (string ISO หรือ timestamp)
  status?: 'published' | 'draft';
};

function asDate(d?: string | number): Date {
  if (!d) return new Date();
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? new Date() : dt;
}

// รองรับ slug ภาษาไทย/ช่องว่าง
const safe = (s: string) => encodeURI(s);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ----- Static URLs -----
  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${base}/`,        changeFrequency: 'daily',  priority: 1.0, lastModified: new Date() },
    { url: `${base}/en`,      changeFrequency: 'daily',  priority: 1.0, lastModified: new Date() },
    { url: `${base}/en/blog`, changeFrequency: 'weekly', priority: 0.9, lastModified: new Date() },
    { url: `${base}/th`,      changeFrequency: 'daily',  priority: 1.0, lastModified: new Date() },
    { url: `${base}/th/blog`, changeFrequency: 'weekly', priority: 0.9, lastModified: new Date() },
  ];

  // ----- Dynamic Posts (ใช้ `date`) -----
  try {
    const postsRef = collection(db, 'posts');

    // ถ้า `date` เป็น string ISO จะสั่ง orderBy ได้
    // (ถ้าไม่ได้เก็บเป็น ISO อาจตัด orderBy ออกได้)
    const q = query(
      postsRef,
      where('status', '==', 'published'),
      orderBy('date', 'desc')
    );

    const snap = await getDocs(q);

    const postEntries: MetadataRoute.Sitemap = snap.docs.map((doc) => {
      const data = doc.data() as PostDoc;
      const lang = data.lang === 'th' ? 'th' : 'th'; // ไม่มี lang ให้ default เป็น 'th'
      const last = asDate(data.date ?? Date.now());

      return {
        url: `${base}/${lang}/blog/${safe(data.slug)}`,
        lastModified: last,
        changeFrequency: 'monthly',
        priority: 0.8,
      };
    });

    return [...staticUrls, ...postEntries];
  } catch {
    // Fallback: ถ้า query ล้มเหลว จะยังมี static sitemap ใช้ได้
    return [...staticUrls];
  }
}
