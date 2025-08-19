// This is the new root layout. It only renders children.
// The actual <html> and <body> tags are now in [lang]/layout.tsx
// to support dynamic metadata for different languages correctly.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
