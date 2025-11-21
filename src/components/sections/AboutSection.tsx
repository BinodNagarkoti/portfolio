import SectionWrapper from '@/components/common/SectionWrapper';
import AboutContent from './AboutContent';
import SkillsSection from './SkillsSection';

const AboutSection = async () => {
  return (
    <SectionWrapper id="about" title="About Me" subtitle="">
      <div className="space-y-8">
        <AboutContent />
      </div>
    </SectionWrapper>
  );
};

export default AboutSection;
