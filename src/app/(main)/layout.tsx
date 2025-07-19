import { FloatingContact } from '@/components/floating-contact';
import { i18n, type Locale } from '@/i18n.config';

export async function generateStaticParams() {
  return i18n.locales.map(locale => ({ lang: locale }))
}

export default function MainLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: Locale }
}) {
  return (
    <div lang={params.locale}>
        {children}
        <FloatingContact locale={params.locale} />
    </div>
  )
}
