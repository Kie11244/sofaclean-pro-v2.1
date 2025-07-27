import { i18n, type Locale } from '@/i18n.config';

export async function generateStaticParams() {
  return i18n.locales.map(locale => ({ locale: locale }))
}

export default function MainLayout({
  children
}: {
  children: React.ReactNode
  params: { locale: Locale }
}) {
  return (
    <>
      {children}
    </>
  )
}
