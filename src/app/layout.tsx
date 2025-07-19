import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FloatingContact } from '@/components/floating-contact';

export const metadata: Metadata = {
  title: 'บริการซักโซฟา ซักเบาะรถยนต์ ซักพรม ครบวงจร | Clean & Care Pro',
  description: 'Clean & Care Pro บริการซักโซฟา ซักเบาะรถยนต์ ซักพรม และที่นอน ถึงบ้านคุณโดยทีมงานมืออาชีพ ขจัดคราบฝังลึก ไรฝุ่น ฆ่าเชื้อโรค ราคาถูก ประเมินราคาฟรีด้วย AI',
  keywords: 'ซักโซฟา, ซักเบาะรถยนต์, ซักพรม, ราคาซักโซฟา, บริษัทซักโซฟา, บริการซักโซฟา, ทำความสะอาดโซฟา, ขจัดคราบโซฟา, ซักที่นอน, ฆ่าเชื้อโรคโซฟา, ไรฝุ่น, Clean & Care Pro',
  authors: [{ name: 'Clean & Care Pro' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The lang attribute will be set in the page layouts
  return (
    <html suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
