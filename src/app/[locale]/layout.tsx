import { i18n, type Locale } from '@/i18n.config';
import { FloatingContact } from '@/components/floating-contact';

export async function generateStaticParams() {
  return i18n.locales.map(locale => ({ locale: locale }))
}

export default async function LocaleLayout({
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
