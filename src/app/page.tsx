
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

export default async function Home() {
    const personalInfo = await getPersonalInfo();
    return (
        <>
            <HeroSection personalInfo={personalInfo} />
            <AboutSection />
            <ExperienceSection />
            <EducationSection />
            <ProjectsSection />
            <AchievementsSection />
            <BlogSection />
            <ContactSection personalInfo={personalInfo} />
        </>
    );
}
