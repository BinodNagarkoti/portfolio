import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Squares from '@/components/reactbits/Backgrounds/Squares/Squares';
import { getPersonalInfo } from '@/lib/actions';
import { staticPersonalInfo } from '@/lib/data';

export async function generateMetadata(): Promise<Metadata> {
  const personalInfo = await getPersonalInfo();
  const info = personalInfo ?? staticPersonalInfo;
  
  const title = `${info.name} | ${info.title}`;
  const description = info.bio || `Portfolio of ${info.name}, a passionate Full Stack Developer.`;

  return {
    title,
    description,
  };
}

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personalInfo = await getPersonalInfo();

  return (
    <div className="font-body antialiased relative">
      <Squares className="absolute inset-0 -z-10 size-full" speed={0.1} squareSize={30} borderColor='hsl(var(--border) / 0.1)' hoverFillColor='hsl(var(--accent) / 0.05)' />
      <Navbar personalInfo={personalInfo ?? staticPersonalInfo} />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
