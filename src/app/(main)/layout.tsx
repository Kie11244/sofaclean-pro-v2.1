import { FloatingContact } from '@/components/floating-contact';
import { getDictionary } from '@/lib/dictionaries';
import { i18n, type Locale } from '@/i18n.config';

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }) {
  const dict = await getDictionary(locale);
  return {
    title: dict.navigation.home,
    description: dict.hero.subtitle,
  };
}

export default async function MainLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: Locale }
}) {
  return (
    <>
      {children}
      <FloatingContact locale={params.locale} />
    </>
  )
}
