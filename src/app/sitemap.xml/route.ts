import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, DocumentData } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Post extends DocumentData {
  slug: string;
  date: string;              // ISO string หรือสตริงวันที่
  status: 'published' | 'draft';
}

// ฮาร์ดโค้ดโดเมนชั่วคราวเพื่อกัน ENV เก่าทับ
const SITE_URL = 'https://sofaclean-pro-v2.vercel.app';

export async function GET() {
  // ดึงโพสต์เรียงตามวันที่
  const postsQuery = query(collection(db, 'posts'), orderBy('date', 'desc'));
  const postsSnapshot = await getDocs(postsQuery);
  const allPosts: Post[] = postsSnapshot.docs.map((doc) => doc.data() as Post);

  // เอาเฉพาะที่เผยแพร่แล้ว
  const publishedPosts = allPosts.filter((post) => post.status === 'published');

  // ถ้ามี 2 ภาษาเป็น /en และ /th ให้คงไว้
  // ถ้าไทยอยู่ที่ "/" ให้เปลี่ยนเป็น ['en'] แล้วเพิ่มรายการของ '/' เองได้
  const LANGS = ['en', 'th'];

  const blogPostUrls = publishedPosts
    .flatMap((post) =>
      LANGS.map((lang) => {
        return `
  <url>
    <loc>${`${SITE_URL}/${lang}/blog/${encodeURIComponent(post.slug)}`}</loc>
    <lastmod>${new Date(post.date).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
      })
    )
    .join('');

  const staticUrls = LANGS
    .flatMap((lang) => [
      { url: `${SITE_URL}/${lang}`, changefreq: 'daily', priority: 1.0 },
      { url: `${SITE_URL}/${lang}/blog`, changefreq: 'weekly', priority: 0.9 },
    ])
    .map(
      ({ url, changefreq, priority }) => `
  <url>
    <loc>${url}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    )
    .join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticUrls}
  ${blogPostUrls}
  <!-- ${SITE_URL} -->
</urlset>`;

  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=UTF-8',
      // ปิดแคชชั่วคราวเพื่อให้เห็นผลทันที
      'Cache-Control': 'no-store',
    },
  });
}
