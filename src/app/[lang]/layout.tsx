
import type { Metadata } from 'next';
import '../globals.css';
import { FloatingContact } from '@/components/floating-contact';
import { Header } from '@/components/header';
import { getDictionary } from '@/lib/dictionaries';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/auth-context';
import { Kanit } from 'next/font/google';

type Props = {
    params: { lang: 'en' | 'th' };
    children: React.ReactNode;
};

const kanit = Kanit({
  subsets: ['latin', 'thai'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-kanit',
});

export async function generateMetadata({ params: { lang } }: Props): Promise<Metadata> {
    const dict = await getDictionary(lang);
    return {
        title: {
            default: `Clean & Care Pro - ${dict.footer.tagline}`,
            template: `%s | Clean & Care Pro`
        },
        description: dict.hero.subtitle,
    };
}

export async function generateStaticParams() {
    return [{ lang: 'en' }, { lang: 'th' }];
}

export default async function LangLayout({
  children,
  params: { lang },
}: Readonly<{
  children: React.ReactNode;
  params: { lang: 'en' | 'th' };
}>) {
    const dict = await getDictionary(lang);
  return (
    <html lang={lang} className={kanit.variable} suppressHydrationWarning>
        <body className="font-body antialiased">
            <AuthProvider>
                <Header dictionary={dict} lang={lang} />
                <main>{children}</main>
                <FloatingContact />
                <Toaster />
            </AuthProvider>
        </body>
    </html>
  );
}
