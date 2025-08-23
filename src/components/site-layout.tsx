
"use client";

import { usePathname } from 'next/navigation';
import { Toaster } from "@/components/ui/toaster";
import { Header } from '@/components/header';
import { FloatingContact } from '@/components/floating-contact';

export function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <>
        {!isAdminPage && <Header />}
        <main>{children}</main>
        {!isAdminPage && <FloatingContact />}
        <Toaster />
    </>
  );
}
