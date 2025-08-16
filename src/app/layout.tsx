
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/auth-context';
import { Kanit } from 'next/font/google';

// This is the root layout. It does not contain language-specific elements
// like Header or Footer, as those will be in the [lang] layout.

export const metadata: Metadata = {
  title: 'Clean & Care Pro - บริการซักโซฟา ซักเบาะรถยนต์ โดยมืออาชีพ',
  description: 'บริการซักโซฟา ซักเบาะรถยนต์ ซักพรม และที่นอน โดยทีมงานมืออาชีพ Clean & Care Pro บริการถึงบ้านและคอนโดในกรุงเทพและปริมณฑล',
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
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
