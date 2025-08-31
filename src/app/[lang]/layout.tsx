// app/[lang]/layout.tsx
import type { Metadata } from 'next';
import { BASE_URL } from '@/lib/site';

type Props = { params: { lang: 'th' | 'en' } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = params.lang === 'en' ? 'en' : 'th';
  const path = `/${lang}`;                // ค่าพื้นฐานสำหรับหน้า index ของภาษานี้
  const canonical = `${BASE_URL}${path}`;

  return {
    alternates: {
      canonical,
      languages: {
        'th-TH': `${BASE_URL}/th`,
        'en-US': `${BASE_URL}/en`,
      },
    },
    openGraph: {
      url: canonical,
      locale: lang === 'th' ? 'th_TH' : 'en_US',
      siteName: 'SofaClean Pro',
    },
  };
}

export default function RootLayout(
  { children }: { children: React.ReactNode }
) {
  return children;
}
