import SectionWrapper from '@/components/common/SectionWrapper';
import ProjectCard from '@/components/common/ProjectCard';
import { getProjects } from '@/lib/actions';
import { staticPersonalInfo } from '@/lib/data';

const ProjectsSection = async () => {
  const result = await getProjects();
  
  // Use static personal info to determine which project gets special styling.
  // In a multi-user CMS, this logic would need to be more robust.
  const featuredProjectTitle = staticPersonalInfo.name.split(' ')[0]; // e.g., 'Binod'

  return (
    <SectionWrapper id="projects" title="Personal Works" subtitle="">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {result.data?.map((project) => (
          <ProjectCard 
            key={project.id} 
            project={project}
            cardStyle={project.title.includes(featuredProjectTitle) ? 'dark' : 'light'}
          />
        ))}
      </div>
       {result.error && <p className="text-center text-destructive">Could not load projects.</p>}
    </SectionWrapper>
  );
};

export default ProjectsSection;
