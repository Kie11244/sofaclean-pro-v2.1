
"use client";

import { usePathname } from 'next/navigation';
import './globals.css';
import { FloatingContact } from '@/components/floating-contact';
import { Header } from '@/components/header';
import { Kanit } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/auth-context';


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
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <html lang="th" className={kanit.variable} suppressHydrationWarning>
        <body className="font-body antialiased">
            <AuthProvider>
                {!isAdminPage && <Header />}
                <main>{children}</main>
                {!isAdminPage && <FloatingContact />}
                <Toaster />
            </AuthProvider>
        </body>
    </html>
  );
}
