import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/auth-context';
import { Kanit } from 'next/font/google';

export const metadata: Metadata = {
  title: 'บริการซักโซฟา ซักเบาะรถยนต์ ซักพรม ครบวงจร | Clean & Care Pro',
  description: 'Clean & Care Pro บริการซักโซฟา ซักเบาะรถยนต์ ซักพรม และที่นอน ถึงบ้านคุณโดยทีมงานมืออาชีพ ขจัดคราบฝังลึก ไรฝุ่น ฆ่าเชื้อโรค ราคาถูก ประเมินราคาฟรีด้วย AI',
  keywords: 'ซักโซฟา, ซักเบาะรถยนต์, ซักพรม, ราคาซักโซฟา, บริษัทซักโซฟา, บริการซักโซฟา, ทำความสะอาดโซฟา, ขจัดคราบโซฟา, ซักที่นอน, ฆ่าเชื้อโรคโซฟา, ไรฝุ่น, Clean & Care Pro',
  authors: [{ name: 'Clean & Care Pro' }],
};

const kanit = Kanit({
  subsets: ['latin', 'thai'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-kanit',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={kanit.variable} suppressHydrationWarning>
      <body className="font-body antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
