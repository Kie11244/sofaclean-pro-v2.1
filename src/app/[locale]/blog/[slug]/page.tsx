import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, Languages } from 'lucide-react';

import { blogData } from '@/lib/blog-data';
import { JsonLD } from '@/components/json-ld';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { dictionaries } from '@/lib/dictionaries';
import { LanguageSwitcher } from '@/components/language-switcher';

export async function generateStaticParams() {
  const params = Object.values(blogData).flatMap(post => {
      return [
          { locale: 'th', slug: post.slug.th },
          { locale: 'en', slug: post.slug.en }
      ];
  });
  return params;
}

export async function generateMetadata({ params }: { params: { slug: string, locale: 'th' | 'en' } }) {
    const post = Object.values(blogData).find(p => p.slug[params.locale] === decodeURIComponent(params.slug));
    if (!post) {
        return {};
    }
    const postContent = post[params.locale];
    return {
        title: `${postContent.title} | Clean & Care Pro`,
        description: postContent.description,
    };
}

export default async function BlogPostPage({ params }: { params: { slug: string, locale: 'th' | 'en' } }) {
  const post = Object.values(blogData).find(p => p.slug[params.locale] === decodeURIComponent(params.slug));
  const dict = await dictionaries[params.locale]();

  if (!post) {
    notFound();
  }
  const postContent = post[params.locale];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://your-website-url.com/${params.locale}/blog/${post.slug[params.locale]}`
    },
    "headline": postContent.title,
    "description": postContent.description,
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
    "datePublished": post.date,
    "inLanguage": params.locale
  };

  const relatedPosts = Object.values(blogData).filter(p => p.slug[params.locale] !== post.slug[params.locale]).slice(0, 2);

  return (
    <>
      <JsonLD data={articleSchema} />
      <div className="bg-background">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <div className="flex justify-between items-center mb-8">
            <Button asChild variant="link" className="text-emerald-600 hover:underline p-0 h-auto">
              <Link href={`/${params.locale}/blog`}>
                <ArrowLeft className="mr-2 h-4 w-4" /> {dict.blogPost.back}
              </Link>
            </Button>
            <LanguageSwitcher />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-12">
            <article className="lg:col-span-3 prose lg:prose-xl max-w-none">
                <div className="mb-6">
                    <p className="text-emerald-600 font-bold">{postContent.category}</p>
                    <h1 className="mb-4">{postContent.title}</h1>
                    <div className="flex items-center text-muted-foreground text-sm">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>{dict.blogPost.publishedOn}: {post.date}</span>
                    </div>
                </div>
                <div className="mb-8">
                <Image
                    className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-lg"
                    src={post.image}
                    alt={postContent.title}
                    width={1200}
                    height={600}
                    data-ai-hint={post.imageHint}
                    priority
                />
                </div>
                
                {postContent.content}
                
                <Separator className="my-12" />

                <div className="mt-8 p-6 bg-emerald-50 rounded-lg border-l-4 border-emerald-500 not-prose">
                    <h3 className="font-bold text-lg text-emerald-800">{dict.blogPost.cta.title}</h3>
                    <p className="text-emerald-900">
                        {dict.blogPost.cta.description} <Link href={`/${params.locale}#ai-quoter`} className="text-emerald-700 font-bold hover:underline">{dict.blogPost.cta.link}</Link> {dict.blogPost.cta.end}
                    </p>
                </div>
            </article>

            <aside className="lg:col-span-1 mt-12 lg:mt-0">
                <div className="sticky top-24">
                    <h3 className="text-xl font-bold mb-4">{dict.blogPost.related.title}</h3>
                    <div className="space-y-4">
                        {relatedPosts.map(related => {
                            const relatedContent = related[params.locale];
                            return (
                             <Card key={related.slug.en} className="overflow-hidden transition-shadow hover:shadow-md">
                                <Link href={`/${params.locale}/blog/${related.slug[params.locale]}`} className="block">
                                    <Image className="w-full h-32 object-cover" src={related.image} alt={relatedContent.title} width={300} height={150} data-ai-hint={related.imageHint} />
                                    <CardContent className="p-4">
                                        <h4 className="font-bold text-base leading-tight hover:text-emerald-600">{relatedContent.title}</h4>
                                    </CardContent>
                                </Link>
                            </Card>
                        )})}
                    </div>
                </div>
            </aside>
          </div>
        </div>
      </div>
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-8 text-center">
            <p>&copy; 2024 Clean & Care Pro. All Rights Reserved.</p>
            <p className="text-sm text-gray-400 mt-1">{dict.footer.tagline}</p>
        </div>
      </footer>
    </>
  );
}
