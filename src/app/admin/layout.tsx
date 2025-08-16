"use client";

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page if not authenticated and not already on the login page.
    if (!loading && !user && window.location.pathname !== '/admin') {
      router.push('/admin');
    }
  }, [user, loading, router]);

  // Add padding-top to push content below the fixed header
  return <div className="pt-24">{children}</div>;
}
