import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/auth-context';
import { Kanit } from 'next/font/google';

const kanit = Kanit({
  subsets: ['latin', 'thai'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-kanit',
});

export const metadata: Metadata = {
  title: 'Clean & Care Pro',
  description: 'Expert cleaning services for sofas, curtains, and more.',
}

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
