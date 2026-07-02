
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import PersonalProjectsSection from '@/components/sections/PersonalProjectsSection';
import ContactSection from '@/components/sections/ContactSection';
import { getPersonalInfo } from '@/lib/actions';
import ExperienceSection from '@/components/sections/ExperienceSection';
import AchievementsSection from '@/components/sections/AchievementsSection';
import BlogSection from '@/components/sections/BlogSection';
import EducationSection from '@/components/sections/EducationSection';
import Squares from '@/components/reactbits/Backgrounds/Squares/Squares';
import Navbar from '@/components/layout/Navbar';
import ThemeShapeGrid from '@/components/reactbits/Backgrounds/ThemeShapeGrid';
import { SITE_URL } from '@/lib/seo/config';

export default async function Home() {
    const personalInfo = await getPersonalInfo();
    
    const profileSchema = {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "mainEntity": {
            "@type": "Person",
            "name": personalInfo?.name ?? 'Binod Nagarkoti',
            "jobTitle": personalInfo?.position ?? 'Software Engineer',
            "url": SITE_URL,
            "sameAs": [
                personalInfo?.github_url,
                personalInfo?.linkedin_url,
                // personalInfo?.twitter_url,
            ].filter(Boolean),
        }
    };

    return (
        <div className="relative min-h-screen justify-center items-center w-full mt-10">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema) }}
            />
            <div className="fixed inset-0 -z-10">
                <ThemeShapeGrid />
            </div>
            <Navbar personalInfo={personalInfo} />
            <HeroSection personalInfo={personalInfo} />
            <AboutSection />
            <SkillsSection />
            <ExperienceSection />
            <EducationSection />
            <ProjectsSection/>
            <AchievementsSection />
            <BlogSection />
            <ContactSection personalInfo={personalInfo} />

        </div>
    );
}
