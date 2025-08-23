
import type { Metadata } from 'next';
import './globals.css';
import { FloatingContact } from '@/components/floating-contact';
import { Header } from '@/components/header';
import { Kanit } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/auth-context';
import { getDictionary } from '@/lib/dictionaries';


const kanit = Kanit({
  subsets: ['latin', 'thai'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-kanit',
});

export async function generateMetadata(): Promise<Metadata> {
    const dict = await getDictionary('th'); // Default to Thai for metadata
    return {
        title: {
            default: `Clean & Care Pro - ${dict.footer.tagline}`,
            template: `%s | Clean & Care Pro`
        },
        description: dict.hero.subtitle,
    };
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
                <Header />
                <main>{children}</main>
                <FloatingContact />
                <Toaster />
            </AuthProvider>
        </body>
    </html>
  );
}
