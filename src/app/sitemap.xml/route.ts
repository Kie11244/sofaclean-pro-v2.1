import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, DocumentData } from 'firebase/firestore';
import { NextResponse } from 'next/server';

interface Post extends DocumentData {
  slug: string;
  date: string; // ISO หรือสตริงวันที่
  status: 'published' | 'draft';
}

// ใช้โดเมนโปรดักชัน (Vercel) เป็นค่าเริ่มต้น และตัด / ท้ายออก
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://sofaclean-pro-v2.vercel.app').replace(/\/+$/, '');

export async function GET() {
  // ดึงโพสต์เรียงตามวันที่ (คงเดิม)
  const postsQuery = query(collection(db, 'posts'), orderBy('date', 'desc'));
  const postsSnapshot = await getDocs(postsQuery);
  const allPosts: Post[] = postsSnapshot.docs.map((doc) => doc.data() as Post);

  // เอาเฉพาะที่เผยแพร่แล้ว (คงเดิม)
  const publishedPosts = allPosts.filter((post) => post.status === 'published');

  // ถ้าเว็บคุณมี 2 ภาษาเป็น /en และ /th ให้คงไว้
  // ถ้า "ไทยอยู่ที่ /" ให้เปลี่ยนจาก ['en','th'] เป็น ['en'] แล้วเพิ่มรายการของ '/' ด้านล่างแทน
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
      }),
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
  </url>`,
    )
    .join('');

  // ถ้า "ไทยอยู่ที่ /" ให้เพิ่มบล็อคนี้แทน /th:
  // const homeTH = `
  //   <url>
  //     <loc>${SITE_URL}/</loc>
  //     <changefreq>daily</changefreq>
  //     <priority>1.0</priority>
  //   </url>
  // `;

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
      // แคชบนเอจ 6 ชม. และให้เสิร์ฟแบบ stale ได้ 1 วัน
      'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=86400',
    },
  });
}
