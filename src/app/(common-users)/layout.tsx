import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Squares from '@/components/reactbits/Backgrounds/Squares/Squares';
import { staticPersonalInfo } from '@/lib/data';
import { SEO_DESCRIPTION_MAX, SEO_TITLE_MAX, SITE_URL } from '@/lib/seo/config';
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

    return (
        <div className="font-body antialiased relative">
            <Squares className="absolute inset-0 -z-10 size-full" speed={0.1} squareSize={30} borderColor='hsl(var(--border) / 0.1)' hoverFillColor='hsl(var(--accent) / 0.05)' />
            <Navbar personalInfo={personalInfo ?? staticPersonalInfo} />
            <main>{children}</main>
            <Footer />
        </div>
    );
}
