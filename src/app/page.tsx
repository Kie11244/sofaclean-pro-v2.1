import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ShieldCheck, MapPin, Phone } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PriceEstimator } from '@/components/price-estimator';
import { Reveal } from '@/components/reveal';
import { JsonLD } from '@/components/json-ld';

const whyUsData = [
  {
    icon: <Sparkles className="h-8 w-8" />,
    title: "สะอาดล้ำลึกถึงใยผ้า",
    description: "เราใช้เครื่องมือซักโซฟาโดยเฉพาะ สามารถขจัดคราบฝังแน่นและไรฝุ่นที่ซ่อนอยู่ลึกในใยผ้าได้อย่างหมดจด",
  },
  {
    icon: <ShieldCheck className="h-8 w-8" />,
    title: "ปลอดภัย ไร้สารตกค้าง",
    description: "น้ำยาซักโซฟาของเรานำเข้าและมีมาตรฐาน ปลอดภัยต่อเด็ก สัตว์เลี้ยง และเป็นมิตรต่อสิ่งแวดล้อม",
  },
  {
    icon: <MapPin className="h-8 w-8" />,
    title: "บริการถึงบ้านคุณ",
    description: "ไม่ต้องยกโซฟาไปไหน เรามีทีมงานบริการซักโซฟาถึงที่บ้าน คอนโด หรือออฟฟิศของคุณในกรุงเทพและปริมณฑล",
  },
];

const faqData = [
    {
        question: "ซักโซฟาใช้เวลานานเท่าไหร่?",
        answer: "โดยทั่วไป การซักโซฟาขนาด 2-3 ที่นั่งจะใช้เวลาประมาณ 1-2 ชั่วโมง ขึ้นอยู่กับชนิดของผ้าและความสกปรกของคราบครับ"
    },
    {
        question: "หลังซักโซฟานานแค่ไหนถึงจะแห้ง?",
        answer: "โซฟาจะแห้งและพร้อมใช้งานภายใน 3-4 ชั่วโมงหลังทำความสะอาดเสร็จสิ้น เราแนะนำให้เปิดพัดลมหรือเครื่องปรับอากาศเพื่อช่วยให้แห้งเร็วขึ้นครับ"
    },
    {
        question: "น้ำยาที่ใช้ปลอดภัยต่อเด็กและสัตว์เลี้ยงหรือไม่?",
        answer: "ปลอดภัยแน่นอนครับ เราเลือกใช้ผลิตภัณฑ์ทำความสะอาดคุณภาพสูงที่สกัดจากธรรมชาติ ไม่มีสารเคมีอันตรายตกค้าง ปลอดภัยสำหรับทุกคนในครอบครัวและสัตว์เลี้ยงของคุณ"
    }
];

const blogPosts = [
    {
        slug: "withi-sak-sofa-pha",
        title: "วิธีซักโซฟาผ้าด้วยตัวเองเบื้องต้น กำจัดคราบง่ายๆ",
        description: "รวมเคล็ดลับและขั้นตอนการทำความสะอาดโซฟาผ้าด้วยของใช้ในบ้าน เพื่อจัดการคราบเล็กๆ น้อยๆ ก่อนเรียกใช้บริการจากมืออาชีพ",
        image: "https://placehold.co/600x400.png",
        imageHint: "woman cleaning"
    },
    {
        slug: "5-sanyan-tuean-sak-bo-rotyon",
        title: "5 สัญญาณเตือน! ถึงเวลาต้องซักเบาะรถยนต์แล้ว",
        description: "เบาะรถยนต์ของคุณมีกลิ่นอับ มีคราบแปลกๆ หรือไม่? มาเช็คสัญญาณที่บ่งบอกว่าเบาะรถของคุณต้องการการทำความสะอาดครั้งใหญ่",
        image: "https://placehold.co/600x400.png",
        imageHint: "car interior"
    },
    {
        slug: "sak-sofa-vs-sak-phrom",
        title: "ซักโซฟา กับ ซักพรม เหมือนหรือต่างกันอย่างไร?",
        description: "หลายคนอาจคิดว่าการซักโซฟาและพรมใช้วิธีเดียวกัน บทความนี้จะมาไขข้อข้องใจถึงความแตกต่างของวัสดุและวิธีการทำความสะอาด",
        image: "https://placehold.co/600x400.png",
        imageHint: "living room"
    }
];

const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Clean & Care Pro",
    "image": "https://placehold.co/2070x1380.png",
    "@id": "",
    "url": "https://your-website-url.com",
    "telephone": "081-234-5678",
    "priceRange": "฿฿",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Sukhumvit Road",
      "addressLocality": "Bangkok",
      "postalCode": "10110",
      "addressCountry": "TH"
    },
    "description": "บริการซักโซฟา ซักเบาะรถยนต์ ซักพรม และที่นอนครบวงจร พร้อมบริการถึงบ้านคุณในเขตกรุงเทพและปริมณฑล",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [ "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday" ],
      "opens": "09:00",
      "closes": "18:00"
    },
    "sameAs": [ "https://www.facebook.com/your-page", "https://line.me/ti/p/~yourlineid" ]
};

const faqPageSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
    }))
};


export default function Home() {
  return (
    <>
      <JsonLD data={localBusinessSchema} />
      <JsonLD data={faqPageSchema} />
      
      <header className="hero-section text-white shadow-lg" data-ai-hint="sofa living room">
        <div className="container mx-auto px-6 py-20 md:py-32 text-center">
          <Reveal>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">บริการซักโซฟา ซักเบาะรถยนต์ อันดับ 1</h1>
          </Reveal>
          <Reveal delay="200ms">
            <p className="text-lg md:text-2xl mb-8 max-w-3xl mx-auto">คืนความใหม่ให้โซฟาและเบาะรถยนต์ของคุณด้วยบริการซักทำความสะอาด ขจัดคราบฝังลึก ไรฝุ่น และกลิ่นไม่พึงประสงค์ โดยทีมงานมืออาชีพ</p>
          </Reveal>
          <Reveal delay="400ms">
            <Button asChild size="lg" className="text-xl h-14 px-10 rounded-full font-bold transition-transform duration-300 hover:scale-105 bg-emerald-500 hover:bg-emerald-600">
              <Link href="#ai-quoter">ประเมินราคาฟรี!</Link>
            </Button>
          </Reveal>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16 space-y-20">
        <section id="why-us" className="text-center">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-12">ทำไมต้องใช้บริการจาก Clean & Care Pro?</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-8">
            {whyUsData.map((item, index) => (
              <Reveal key={index} delay={`${index * 200}ms`}>
                <Card className="p-8 rounded-xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full">
                  <CardHeader className="p-0 items-center">
                    <div className="bg-emerald-100 text-emerald-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      {item.icon}
                    </div>
                    <CardTitle className="text-xl font-bold mb-2">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-gray-600">{item.description}</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="before-after">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">ผลงานซักโซฟาและเบาะรถยนต์</h2>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-4 md:gap-8">
            <Reveal>
              <Card className="rounded-lg shadow-lg overflow-hidden">
                <Image src="https://placehold.co/600x400.png" alt="ภาพก่อนซักโซฟาผ้าสีขาวที่มีคราบสกปรก" width={600} height={400} className="w-full h-80 object-cover" data-ai-hint="dirty sofa"/>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-red-600 text-center">ก่อนซัก</h3>
                  <p className="text-gray-600 text-center mt-2">โซฟาผ้ามีคราบฝุ่นและรอยเปื้อนสะสม</p>
                </div>
              </Card>
            </Reveal>
            <Reveal delay="200ms">
              <Card className="rounded-lg shadow-lg overflow-hidden">
                <Image src="https://placehold.co/600x400.png" alt="ภาพหลังซักโซฟาผ้าสีขาวที่สะอาดเหมือนใหม่" width={600} height={400} className="w-full h-80 object-cover" data-ai-hint="clean sofa"/>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-green-600 text-center">หลังซัก</h3>
                  <p className="text-gray-600 text-center mt-2">โซฟากลับมาสะอาด สีสดใสเหมือนใหม่</p>
                </div>
              </Card>
            </Reveal>
          </div>
        </section>

        <section id="blog">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">บทความและเคล็ดลับการดูแลโซฟา</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <Reveal key={post.slug} delay={`${index * 200}ms`}>
                <Card className="rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-all duration-300 h-full flex flex-col">
                  <Link href={`/blog/${post.slug}`} className="block">
                    <Image className="w-full h-48 object-cover" src={post.image} alt={post.title} width={600} height={400} data-ai-hint={post.imageHint} />
                  </Link>
                  <CardContent className="p-6 flex flex-col flex-grow">
                    <h3 className="font-bold text-xl mb-2">{post.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 flex-grow">{post.description}</p>
                    <Link href={`/blog/${post.slug}`} className="font-semibold text-emerald-600 hover:text-emerald-700 self-start">
                      อ่านต่อ...
                    </Link>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </section>

        <Reveal>
          <PriceEstimator />
        </Reveal>

        <section id="faq">
            <Reveal>
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">คำถามที่พบบ่อยเกี่ยวกับการซักโซฟา</h2>
            </Reveal>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full space-y-4">
                {faqData.map((faq, index) => (
                   <Reveal key={index} delay={`${index * 100}ms`}>
                    <AccordionItem value={`item-${index}`} className="bg-white p-2 rounded-xl shadow-md border-b-0">
                      <AccordionTrigger className="text-lg font-bold text-left px-4 hover:no-underline">{faq.question}</AccordionTrigger>
                      <AccordionContent className="px-4 text-base text-gray-600">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                   </Reveal>
                ))}
              </Accordion>
            </div>
        </section>

        <Reveal>
            <section id="booking" className="bg-gray-800 text-white p-8 md:p-12 rounded-xl shadow-xl">
                <div className="text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">สนใจบริการซักโซฟา-ซักเบาะรถยนต์?</h2>
                    <p className="text-gray-300 mb-8 max-w-2xl mx-auto">ติดต่อเราเพื่อประเมินราคาหน้างานฟรี! หรือส่งรูปมาให้เราประเมินราคาเบื้องต้นได้เลย ทีมงาน Clean & Care Pro พร้อมให้บริการ</p>
                    <Button asChild size="lg" className="text-xl h-14 px-10 rounded-full font-bold transition-transform duration-300 hover:scale-105 bg-emerald-500 hover:bg-emerald-600">
                      <a href="tel:0812345678"><Phone className="mr-2" /> โทรเลย: 081-234-5678</a>
                    </Button>
                </div>
            </section>
        </Reveal>
      </main>

      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-8 text-center">
            <p>&copy; 2024 Clean & Care Pro. All Rights Reserved.</p>
            <p className="text-sm text-gray-400 mt-1">ผู้เชี่ยวชาญด้านบริการซักโซฟา ซักเบาะรถยนต์ ซักพรม และซักที่นอน</p>
        </div>
      </footer>
    </>
  );
}
