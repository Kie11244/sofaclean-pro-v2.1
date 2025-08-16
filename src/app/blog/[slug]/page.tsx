import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, DocumentData } from 'firebase/firestore';

import { JsonLD } from '@/components/json-ld';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import dict from '@/lib/dictionaries/th.json';

interface Post extends DocumentData {
    id: string;
    title: string;
    slug: string;
    image: string;
    imageHint: string;
    date: string;
    category: string;
    description: string;
    content: string;
    metaTitle?: string;
    metaDescription?: string;
}

// Fetch all posts from Firestore
async function getPosts(): Promise<Post[]> {
    const postsCol = collection(db, 'posts');
    const postSnapshot = await getDocs(postsCol);
    const postList = postSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
    return postList;
}

// Fetch a single post by slug
async function getPost(slug: string): Promise<Post | null> {
    const q = query(collection(db, "posts"), where("slug", "==", slug));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        return null;
    }
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Post;
}

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map(post => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const post = await getPost(decodeURIComponent(params.slug));
    if (!post) {
        return {};
    }
    const metaTitle = post.metaTitle || post.title;
    const metaDescription = post.metaDescription || post.description;

    return {
        title: `${metaTitle} | SofaClean Pro`,
        description: metaDescription,
    };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(decodeURIComponent(params.slug));

  if (!post) {
    notFound();
  }

  const allPosts = await getPosts();
  const relatedPosts = allPosts.filter(p => p.id !== post.id).slice(0, 2);
  
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
        "name": "SofaClean Pro"
    },  
    "publisher": {
        "@type": "Organization",
        "name": "SofaClean Pro",
        "logo": {
            "@type": "ImageObject",
            "url": "https://your-website-url.com/logo.png"
        }
    },
    "datePublished": post.date,
    "inLanguage": "th"
  };

  return (
    <>
      <JsonLD data={articleSchema} />
      <div className="bg-background pt-20">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <div className="flex justify-between items-center mb-8">
            <Button asChild variant="link" className="text-emerald-600 hover:underline p-0 h-auto">
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" /> {dict.blogPost.back}
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-12">
            <article className="lg:col-span-3 prose lg:prose-xl max-w-none">
                <div className="mb-6">
                    <p className="text-emerald-600 font-bold">{post.category}</p>
                    <h1 className="mb-4">{post.title}</h1>
                    <div className="flex items-center text-muted-foreground text-sm">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>{dict.blogPost.publishedOn}: {new Date(post.date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
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
                
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
                
                <Separator className="my-12" />

                <div className="mt-8 p-6 bg-emerald-50 rounded-lg border-l-4 border-emerald-500 not-prose">
                    <h3 className="font-bold text-lg text-emerald-800">{dict.blogPost.cta.title}</h3>
                    <p className="text-emerald-900">
                        {dict.blogPost.cta.description} <Link href="/#services" className="text-emerald-700 font-bold hover:underline">{dict.blogPost.cta.link}</Link> {dict.blogPost.cta.end}
                    </p>
                </div>
            </article>

            <aside className="lg:col-span-1 mt-12 lg:mt-0">
                <div className="sticky top-24">
                    <h3 className="text-xl font-bold mb-4">{dict.blogPost.related.title}</h3>
                    <div className="space-y-4">
                        {relatedPosts.map(related => {
                            const relatedUrl = `/blog/${related.slug}`;
                            return (
                             <Card key={related.id} className="overflow-hidden transition-shadow hover:shadow-md">
                                <Link href={relatedUrl} className="block">
                                    <Image className="w-full h-32 object-cover" src={related.image} alt={related.title} width={300} height={150} data-ai-hint={related.imageHint} />
                                    <CardContent className="p-4">
                                        <h4 className="font-bold text-base leading-tight hover:text-emerald-600">{related.title}</h4>
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
            <p>&copy; 2024 SofaClean Pro. All Rights Reserved.</p>
            <p className="text-sm text-gray-400 mt-1">{dict.footer.tagline}</p>
        </div>
      </footer>
    </>
  );
}
