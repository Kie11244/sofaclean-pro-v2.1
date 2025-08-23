// This layout is intentionally minimal. 
// The actual root layout is in [lang]/layout.tsx
// This setup is required for the i18n routing to work correctly.
export default function RootRouteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
