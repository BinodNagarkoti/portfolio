
import SectionWrapper from '@/components/common/SectionWrapper';
import ProjectCard from '@/components/common/ProjectCard';
import { personalProjectsData } from '@/lib/data';

const PersonalProjectsSection = () => {
  if (!personalProjectsData || personalProjectsData.length === 0) {
    return null; // Don't render section if there's no data
  }

  return (
    <SectionWrapper id="personal-projects" title="Personal Projects" subtitle="Explorations & AI Experiments">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {personalProjectsData.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </SectionWrapper>
  );
};

export default PersonalProjectsSection;
