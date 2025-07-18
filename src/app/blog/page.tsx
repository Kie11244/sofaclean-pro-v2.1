import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { blogData } from '@/lib/blog-data';
import { Reveal } from '@/components/reveal';

export const metadata = {
  title: 'บทความทั้งหมด | Clean & Care Pro',
  description: 'รวมบทความ เคล็ดลับ และเกร็ดความรู้เกี่ยวกับการดูแลทำความสะอาดโซฟา เบาะรถยนต์ และพรม จากทีมงาน Clean & Care Pro',
};

export default function BlogIndexPage() {
  const posts = Object.values(blogData).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-gray-50/50">
        <header className="bg-white shadow-sm">
            <div className="container mx-auto px-6 py-12 text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800">บทความและเคล็ดลับ</h1>
                <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                    อัปเดตความรู้และเทคนิคการดูแลรักษาเฟอร์นิเจอร์ผ้าของคุณให้สะอาดเหมือนใหม่ได้ที่นี่
                </p>
            </div>
        </header>

        <main className="container mx-auto px-6 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post, index) => (
                    <Reveal key={post.slug} delay={`${index * 100}ms`}>
                        <Card className="rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-all duration-300 h-full flex flex-col group">
                            <Link href={`/blog/${post.slug}`} className="block">
                                <div className="overflow-hidden">
                                    <Image
                                        className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                                        src={post.image}
                                        alt={post.title}
                                        width={600}
                                        height={400}
                                        data-ai-hint={post.imageHint}
                                    />
                                </div>
                            </Link>
                            <CardContent className="p-6 flex flex-col flex-grow">
                                <p className="text-sm text-emerald-600 font-semibold mb-2">{post.category}</p>
                                <h2 className="font-bold text-xl mb-3 flex-grow">
                                     <Link href={`/blog/${post.slug}`} className="hover:text-emerald-700 transition-colors">{post.title}</Link>
                                </h2>
                                <p className="text-gray-600 text-sm mb-4">{post.description}</p>
                                <div>
                                    <Button asChild variant="link" className="p-0 h-auto font-semibold text-emerald-600 hover:text-emerald-700">
                                        <Link href={`/blog/${post.slug}`}>
                                            อ่านต่อ &rarr;
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </Reveal>
                ))}
            </div>
        </main>
         <footer className="bg-gray-900 text-white">
            <div className="container mx-auto px-6 py-8 text-center">
                <p>&copy; 2024 Clean & Care Pro. All Rights Reserved.</p>
                <p className="text-sm text-gray-400 mt-1">ผู้เชี่ยวชาญด้านบริการซักโซฟา ซักเบาะรถยนต์ ซักพรม และซักที่นอน</p>
            </div>
      </footer>
    </div>
  );
}
