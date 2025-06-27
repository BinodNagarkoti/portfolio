

import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import EducationSection from '@/components/sections/EducationSection';
import ContactSection from '@/components/sections/ContactSection';
import BlogSection from '@/components/sections/BlogSection';
import AchievementsSection from '@/components/sections/AchievementsSection';
import { getPersonalInfo } from '@/lib/actions';
import { staticPersonalInfo } from '@/lib/data';

export default async function Home() {
  const personalInfo = await getPersonalInfo();
  const info = personalInfo ?? staticPersonalInfo;

  return (
    <>
      <HeroSection personalInfo={info} />
      <AboutSection />
      <ExperienceSection />
      <EducationSection />
      <ProjectsSection />
      <AchievementsSection />
      <BlogSection />
      <ContactSection personalInfo={info} />
    </>
  );
}
