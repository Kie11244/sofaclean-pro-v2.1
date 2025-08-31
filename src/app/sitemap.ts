// src/app/sitemap.ts
import type { MetadataRoute } from 'next';

console.log("POSTS SNAP:", postsSnap.docs.map(d => d.data()));

export const revalidate = 3600; // พอเหมาะสำหรับ sitemap

function getBaseUrl(): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, '');
  return env || 'https://sofaclean-pro-v2.vercel.app';
}
const base = getBaseUrl();

// Firestore (web SDK ใช้ได้ใน route handler/server component)
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

type PostDoc = {
  slug?: string;
  lang?: 'th' | 'en';
  status?: 'published' | 'draft';
  date?: string | number;
  updatedAt?: string | number;
};

const asDate = (d?: string | number) => {
  const t = d ? new Date(d) : new Date();
  return isNaN(t.getTime()) ? new Date() : t;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // static ขั้นต่ำเท่าที่มั่นใจว่ามีจริง
  const urls: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: 'daily', priority: 1, lastModified: new Date() },
  ];

  try {
    const snap = await getDocs(
      query(collection(db, 'posts'), where('status', '==', 'published'))
    );

    const langs = new Set<'th' | 'en'>();
    const postEntries: MetadataRoute.Sitemap = [];

    for (const doc of snap.docs) {
      const p = doc.data() as PostDoc;
      if (!p?.slug) continue;                     // กัน slug ว่าง
      const lang = p.lang === 'en' ? 'en' : 'th'; // default เป็น th
      langs.add(lang);

      postEntries.push({
        url: `${base}/${lang}/blog/${encodeURIComponent(p.slug)}`,
        lastModified: asDate(p.updatedAt ?? p.date),
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }

    // เพิ่ม index ของแต่ละภาษา “เฉพาะภาษาที่มีจริง”
    for (const lang of langs) {
      urls.push(
        { url: `${base}/${lang}`,      changeFrequency: 'daily',  priority: 1,   lastModified: new Date() },
        { url: `${base}/${lang}/blog`, changeFrequency: 'weekly', priority: 0.9, lastModified: new Date() },
      );
    }

    // รวม, กรองซ้ำ, เรียง
    const seen = new Set<string>();
    const all = [...urls, ...postEntries].filter(item => {
      if (!item.url) return false;
      if (seen.has(item.url)) return false;
      seen.add(item.url);
      return true;
    }).sort((a, b) => a.url.localeCompare(b.url));

    return all;
  } catch {
    // ถ้าอ่าน Firestore ไม่ได้ — ให้มีเฉพาะโฮมเพจ (เลี่ยงใส่ URL ที่อาจ 404)
    return urls;
  }
}
