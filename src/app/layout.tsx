import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/auth-context';
import { Kanit } from 'next/font/google';
import { i18n, type Locale } from '@/i18n.config';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  if (locale === 'th') {
    return {
      title: 'Clean & Care Pro - บริการซักโซฟา ซักเบาะรถยนต์ โดยมืออาชีพ',
      description: 'บริการซักโซฟา ซักเบาะรถยนต์ ซักพรม และที่นอน โดยทีมงานมืออาชีพ Clean & Care Pro บริการถึงบ้านและคอนโดในกรุงเทพและปริมณฑล',
    }
  } else {
     return {
      title: 'Clean & Care Pro - Professional Sofa & Car Seat Cleaning',
      description: 'Professional sofa, car seat, carpet, and mattress cleaning services by Clean & Care Pro. On-site service in Bangkok and surrounding areas.',
    }
  }
}

const kanit = Kanit({
  subsets: ['latin', 'thai'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-kanit',
});

export default function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  return (
    <html lang={params.locale ?? i18n.defaultLocale} className={kanit.variable} suppressHydrationWarning>
      <body className="font-body antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
