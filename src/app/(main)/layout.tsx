import { FloatingContact } from '@/components/floating-contact';
import { i18n, type Locale } from '@/i18n.config';

export async function generateStaticParams() {
  return i18n.locales.map(locale => ({ locale: locale }))
}

export default function MainLayout({
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
