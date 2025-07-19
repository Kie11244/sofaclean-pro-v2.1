import { redirect } from 'next/navigation'

// This file is no longer needed as the root will be handled by /app/(main)/page.tsx
// However, keeping a root redirect can be a good fallback.
export default function RootPage() {
  redirect('/th')
}
