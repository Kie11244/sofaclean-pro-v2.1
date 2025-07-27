import type { Metadata } from "next";
import { i18n, type Locale } from "@/i18n.config";

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  if (locale === 'th') {
    return {
      title: 'Clean & Care Pro - บริการซักโซฟา ซักเบาะรถยนต์ โดยมืออาชีพ',
      description: 'บริการซักโซฟา ซักเบาะรถยนต์ ซักพรม และที่นอน โดยทีมงานมืออาชีพ Clean & Care Pro บริการถึงบ้านและคอนโดในกรุงเทพและปริมณฑล',
    }
  } else {
     return {
      title: 'Clean & Care Pro - Professional Sofa & Car Seat Cleaning',
      description: 'Professional sofa, car seat, carpet, and mattress cleaning services by Clean & Care Pro. On-site service in Bangkok and surrounding areas.',
    }
  }
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  return children;
}
