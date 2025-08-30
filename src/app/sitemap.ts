// src/app/sitemap.ts
// ✅ Dynamic + ดึงทุกบทความจาก Firestore
export const revalidate = 60;             // อัปเดตอย่างน้อยทุก 60 วิ
export const dynamic = 'force-dynamic';   // กัน cache ดื้อ ๆ

import type { MetadataRoute } from 'next';

// ---- Base URL (ควรตั้ง ENV ให้ครบ Dev/Preview/Prod) ----
function getBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '');
  if (fromEnv) return fromEnv;
  return 'https://sofaclean-pro-v2.vercel.app'; // fallback
}
const base = getBaseUrl();

// ---- Firestore ----
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

// ---- Types & utils ----
type PostDoc = {
  slug: string;
  lang?: 'th' | 'en';
  status?: 'published' | 'draft';
  date?: string | number;        // string ISO หรือ timestamp
  updatedAt?: string | number;   // (ถ้ามี)
};

const safe = (s: string) => encodeURI(s);
const asDate = (d?: string | number) => {
  if (!d) return new Date();
  const t = new Date(d);
  return isNaN(t.getTime()) ? new Date() : t;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ----- Static URLs -----
  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${base}/`,        changeFrequency: 'daily',  priority: 1.0, lastModified: new Date() },
    { url: `${base}/en`,      changeFrequency: 'daily',  priority: 1.0, lastModified: new Date() },
    { url: `${base}/en/blog`, changeFrequency: 'weekly', priority: 0.9, lastModified: new Date() },
    { url: `${base}/th`,      changeFrequency: 'daily',  priority: 1.0, lastModified: new Date() },
    { url: `${base}/th/blog`, changeFrequency: 'weekly', priority: 0.9, lastModified: new Date() },
  ];

  // ----- Dynamic Posts: ดึง "ทุก" บทความที่ published -----
  // หมายเหตุ: ไม่ใส่ orderBy → เลี่ยง requirement เรื่อง Composite Index
  try {
    const postsSnap = await getDocs(
      query(collection(db, 'posts'), where('status', '==', 'published'))
    );

    const postEntries: MetadataRoute.Sitemap = postsSnap.docs.map((doc) => {
      const data = doc.data() as PostDoc;

      // default ภาษาเป็น th ถ้าไม่ระบุ
      const lang = data.lang === 'en' ? 'en' : 'th';

      // ใช้ updatedAt ถ้ามี ไม่งั้นใช้ date
      const last = asDate(data.updatedAt ?? data.date ?? Date.now());

      return {
        url: `${base}/${lang}/blog/${safe(data.slug)}`,
        lastModified: last,
        changeFrequency: 'monthly',
        priority: 0.8,
      };
    });

    return [...staticUrls, ...postEntries];
  } catch {
    // ถ้าดึง Firestore ล้มเหลว ยังมี static sitemap ใช้งานได้
    return [...staticUrls];
  }
}
