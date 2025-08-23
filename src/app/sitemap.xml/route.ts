
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, where, DocumentData } from 'firebase/firestore';
import {NextResponse} from 'next/server';

interface Post extends DocumentData {
    slug: string;
    date: string;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://psychic-glider-453312-k0.firebaseapp.com';

export async function GET() {
    const postsQuery = query(
        collection(db, 'posts'), 
        where('status', '==', 'published'),
        orderBy('date', 'desc')
    );
    const postsSnapshot = await getDocs(postsQuery);
    const posts: Post[] = postsSnapshot.docs.map(doc => doc.data() as Post);

    const blogPostUrls = posts.flatMap(post => {
        return ['en', 'th'].map(lang => {
            return `
        <url>
            <loc>${`${SITE_URL}/${lang}/blog/${encodeURIComponent(post.slug)}`}</loc>
            <lastmod>${new Date(post.date).toISOString()}</lastmod>
            <changefreq>monthly</changefreq>
            <priority>0.8</priority>
        </url>`;
        });
    }).join('');

    const staticUrls = ['en', 'th'].flatMap(lang => [
        { url: `${SITE_URL}/${lang}`, changefreq: 'daily', priority: 1.0 },
        { url: `${SITE_URL}/${lang}/blog`, changefreq: 'weekly', priority: 0.9 },
    ]).map(({ url, changefreq, priority }) => `
        <url>
            <loc>${url}</loc>
            <changefreq>${changefreq}</changefreq>
            <priority>${priority}</priority>
        </url>`).join('');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticUrls}
    ${blogPostUrls}
</urlset>`;

    const response = new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
      },
    });

    return response;
}
