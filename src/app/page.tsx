
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

export default async function Home() {
    const personalInfo = await getPersonalInfo();
    return (
        <>
            <Squares className="absolute inset-0 -z-10 size-full" speed={0.1} squareSize={30} borderColor='hsl(var(--border) / 0.1)' hoverFillColor='hsl(var(--accent) / 0.05)' />
            <Navbar personalInfo={personalInfo} />
            <HeroSection personalInfo={personalInfo} />
            <AboutSection />
            <ExperienceSection />
            <EducationSection />
            <ProjectsSection personalInfo={personalInfo} />
            <AchievementsSection />
            <BlogSection />
            <ContactSection personalInfo={personalInfo} />
        </>
    );
}
