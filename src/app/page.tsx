
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
import ShapeGrid from '@/components/reactbits/Backgrounds/ShapeGrid';

export default async function Home() {
    const personalInfo = await getPersonalInfo();
    return (
        <div className="relative min-h-screen justify-center items-center w-full mt-10">
            <div className="fixed inset-0 -z-10">
                <ShapeGrid
                speed={0.5}
                squareSize={40}
                direction='diagonal'
                borderColor="#2F293A"
                hoverFillColor='#222'
                shape='square'
                hoverTrailAmount={0}
                />
            </div>
            <Navbar personalInfo={personalInfo} />
            <HeroSection personalInfo={personalInfo} />
            <AboutSection />
            <SkillsSection />
            <ExperienceSection />
            <EducationSection />
            <ProjectsSection personalInfo={personalInfo} />
            <AchievementsSection />
            <BlogSection />
            <ContactSection personalInfo={personalInfo} />

        </div>
    );
}
