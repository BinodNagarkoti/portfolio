import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { staticPersonalInfo } from '@/lib/data';
import {
  SEO_DESCRIPTION_MAX,
  SEO_TITLE_MAX,
  SITE_NAME,
  SITE_URL,
} from '@/lib/seo/config';
import { getCachedPersonalInfo } from '@/lib/seo/cache';
import { truncateForSeo } from '@/lib/seo/paths';

export async function generateMetadata(): Promise<Metadata> {
  const personalInfo = await getCachedPersonalInfo();
  const info = personalInfo ?? staticPersonalInfo;

  const title = truncateForSeo(`${info.name} | ${info.title}`, SEO_TITLE_MAX);
  const description = truncateForSeo(
    info.bio || `Portfolio of ${info.name}, a passionate Full Stack Developer.`,
    SEO_DESCRIPTION_MAX,
  );

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical: '/' },
    openGraph: {
      type: 'website',
      url: '/',
      title,
      description,
      siteName: SITE_NAME,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personalInfo = await getCachedPersonalInfo();
  const info = personalInfo ?? staticPersonalInfo;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: info.bio || `Portfolio of ${info.name}, a passionate Full Stack Developer.`,
    author: {
      '@type': 'Person',
      name: info.name,
    },
  };

  return (
    <div className="font-body antialiased relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar personalInfo={info} />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
