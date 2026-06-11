import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Binodfolio Admin',
  description: 'Admin panel for Binodfolio.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function AdminRouteGroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // This layout is the root for the (admin) route group.
  // It provides a clean slate, separate from the public layout.
  return <>{children}</>;
}
