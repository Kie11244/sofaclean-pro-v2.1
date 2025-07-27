import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/auth-context';
import { Kanit } from 'next/font/google';
import { i18n } from '@/i18n.config';

export const metadata: Metadata = {
  title: 'Clean & Care Pro',
  description: 'บริการซักโซฟา ซักเบาะรถยนต์ ซักพรม และที่นอน โดยทีมงานมืออาชีพ',
};

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
