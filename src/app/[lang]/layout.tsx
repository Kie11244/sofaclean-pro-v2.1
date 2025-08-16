
import type { Metadata } from 'next';
import '../globals.css';
import { FloatingContact } from '@/components/floating-contact';
import { Header } from '@/components/header';
import { getDictionary } from '@/lib/dictionaries';

type Props = {
    params: { lang: 'en' | 'th' };
    children: React.ReactNode;
};

export async function generateMetadata({ params: { lang } }: Props): Promise<Metadata> {
    const dict = await getDictionary(lang);
    return {
        title: 'Clean & Care Pro - ' + dict.navigation.home,
        description: dict.hero.subtitle,
    };
}

export async function generateStaticParams() {
    return [{ lang: 'en' }, { lang: 'th' }];
}

export default async function LangLayout({
  children,
  params: { lang },
}: Props) {
    const dict = await getDictionary(lang);
  return (
    <>
      <Header dictionary={dict} lang={lang} />
      <main>{children}</main>
      <FloatingContact />
    </>
  );
}
