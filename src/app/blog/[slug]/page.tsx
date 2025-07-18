import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';

import { blogData } from '@/lib/blog-data';
import { JsonLD } from '@/components/json-ld';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export async function generateStaticParams() {
  return Object.values(blogData).map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const post = Object.values(blogData).find(p => p.slug === decodeURIComponent(params.slug));
    if (!post) {
        return {};
    }
    return {
        title: `${post.title} | Clean & Care Pro`,
        description: post.description,
    };
}


export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = Object.values(blogData).find(p => p.slug === decodeURIComponent(params.slug));

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

  const relatedPosts = Object.values(blogData).filter(p => p.slug !== post.slug).slice(0, 2);

  return (
    <>
      <JsonLD data={articleSchema} />
      <div className="bg-background">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <Button asChild variant="link" className="text-emerald-600 hover:underline mb-8 p-0 h-auto">
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" /> กลับไปหน้าบทความ
            </Link>
          </Button>
          <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-12">
            <article className="lg:col-span-3 prose lg:prose-xl max-w-none">
                <div className="mb-6">
                    <p className="text-emerald-600 font-bold">{post.category}</p>
                    <h1 className="mb-4">{post.title}</h1>
                    <div className="flex items-center text-muted-foreground text-sm">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>เผยแพร่เมื่อ: {post.date}</span>
                    </div>
                </div>
                <div className="mb-8">
                <Image
                    className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-lg"
                    src={post.image}
                    alt={post.title}
                    width={1200}
                    height={600}
                    data-ai-hint={post.imageHint}
                    priority
                />
                </div>
                
                {post.content}
                
                <Separator className="my-12" />

                <div className="mt-8 p-6 bg-emerald-50 rounded-lg border-l-4 border-emerald-500 not-prose">
                    <h3 className="font-bold text-lg text-emerald-800">ต้องการผู้เชี่ยวชาญ?</h3>
                    <p className="text-emerald-900">หากคุณพบว่าคราบสกปรกนั้นจัดการได้ยาก หรือต้องการทำความสะอาดครั้งใหญ่เพื่อฆ่าเชื้อโรคและไรฝุ่นอย่างหมดจด การเรียกใช้ <Link href="/#ai-quoter" className="text-emerald-700 font-bold hover:underline">บริการซักทำความสะอาดจากผู้เชี่ยวชาญ</Link> ของเราคือทางเลือกที่ดีที่สุดครับ!</p>
                </div>
            </article>

            <aside className="lg:col-span-1 mt-12 lg:mt-0">
                <div className="sticky top-24">
                    <h3 className="text-xl font-bold mb-4">บทความที่เกี่ยวข้อง</h3>
                    <div className="space-y-4">
                        {relatedPosts.map(related => (
                             <Card key={related.slug} className="overflow-hidden transition-shadow hover:shadow-md">
                                <Link href={`/blog/${related.slug}`} className="block">
                                    <Image className="w-full h-32 object-cover" src={related.image} alt={related.title} width={300} height={150} data-ai-hint={related.imageHint} />
                                    <CardContent className="p-4">
                                        <h4 className="font-bold text-base leading-tight hover:text-emerald-600">{related.title}</h4>
                                    </CardContent>
                                </Link>
                            </Card>
                        ))}
                    </div>
                </div>
            </aside>
          </div>
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
