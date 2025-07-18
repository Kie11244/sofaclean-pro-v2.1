import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { blogData } from '@/lib/blog-data';
import { JsonLD } from '@/components/json-ld';
import { Button } from '@/components/ui/button';

export async function generateStaticParams() {
  return Object.keys(blogData).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const post = blogData[params.slug];
    if (!post) {
        return {};
    }
    return {
        title: `${post.title} | Clean & Care Pro`,
        description: post.description,
    };
}


export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogData[params.slug];

  if (!post) {
    notFound();
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://your-website-url.com/blog/${post.slug}`
    },
    "headline": post.title,
    "description": post.description,
    "image": post.image,  
    "author": {
        "@type": "Organization",
        "name": "Clean & Care Pro"
    },  
    "publisher": {
        "@type": "Organization",
        "name": "Clean & Care Pro",
        "logo": {
            "@type": "ImageObject",
            "url": "https://your-website-url.com/logo.png"
        }
    },
    "datePublished": post.date
  };

  const relatedPosts = Object.values(blogData).filter(p => p.slug !== post.slug);

  return (
    <>
      <JsonLD data={articleSchema} />
      <div className="bg-white">
        <div className="container mx-auto px-6 py-16">
          <Button asChild variant="link" className="text-emerald-600 hover:underline mb-8 p-0 h-auto">
            <Link href="/#blog">
              <ArrowLeft className="mr-2 h-4 w-4" /> กลับไปหน้าบทความ
            </Link>
          </Button>
          <article className="prose lg:prose-xl max-w-none">
            <div className="mb-8">
              <Image
                className="w-full h-auto max-h-[450px] object-cover rounded-lg shadow-lg"
                src={post.image}
                alt={post.title}
                width={1200}
                height={600}
                data-ai-hint={post.imageHint}
                priority
              />
            </div>
            <h1>{post.title}</h1>
            {post.content}
            
            <div className="mt-12 p-6 bg-emerald-50 rounded-lg border-l-4 border-emerald-500 not-prose">
              <h3 className="font-bold text-lg text-emerald-800">ต้องการผู้เชี่ยวชาญ?</h3>
              <p className="text-emerald-900">หากคุณพบว่าคราบสกปรกนั้นจัดการได้ยาก หรือต้องการทำความสะอาดครั้งใหญ่เพื่อฆ่าเชื้อโรคและไรฝุ่นอย่างหมดจด การเรียกใช้ <Link href="/#booking" className="text-emerald-700 font-bold hover:underline">บริการซักทำความสะอาดจากผู้เชี่ยวชาญ</Link> ของเราคือทางเลือกที่ดีที่สุดครับ!</p>
            </div>

            <div className="mt-12 not-prose">
                <h3 className="font-bold text-xl mb-4">บทความที่เกี่ยวข้อง</h3>
                <div className="space-y-2">
                    {relatedPosts.map(related => (
                        <Link key={related.slug} href={`/blog/${related.slug}`} className="text-indigo-600 hover:underline block">
                            {related.title}
                        </Link>
                    ))}
                </div>
            </div>
          </article>
        </div>
      </div>
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-8 text-center">
            <p>&copy; 2024 Clean & Care Pro. All Rights Reserved.</p>
            <p className="text-sm text-gray-400 mt-1">ผู้เชี่ยวชาญด้านบริการซักโซฟา ซักเบาะรถยนต์ ซักพรม และซักที่นอน</p>
        </div>
      </footer>
    </>
  );
}
