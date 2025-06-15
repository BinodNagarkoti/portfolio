
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Project } from '@/lib/data';
import { EyeIcon } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Card className="group flex flex-col h-full overflow-hidden shadow-lg rounded-xl transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-card/90 backdrop-blur-sm">
      <CardHeader className="p-0 relative">
        <div className="aspect-video overflow-hidden">
          <Image
            src={project.imageUrl}
            alt={project.title}
            width={600}
            height={400}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
            data-ai-hint={project.imageHint}
          />
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardTitle className="text-2xl font-bold mb-2 font-headline text-primary group-hover:text-accent transition-colors">
          {project.title}
        </CardTitle>
        <CardDescription className="text-muted-foreground mb-4 text-sm leading-relaxed">
          {project.description}
        </CardDescription>
        <div className="mb-4">
          <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Technologies Used:</h4>
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 5).map((tech) => ( 
              <Badge 
                key={tech} 
                variant="secondary" 
                className="bg-primary/10 text-primary group-hover:bg-accent/20 group-hover:text-accent-foreground transition-colors"
              >
                {tech}
              </Badge>
            ))}
            {project.technologies.length > 5 && (
              <Badge variant="secondary" className="bg-muted/50 text-muted-foreground">
                +{project.technologies.length - 5} more
              </Badge>
            )}
          </div>
        </div>
         <div className="mb-4">
          <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Category:</h4>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 bg-muted/20 border-t border-border">
        <div className="flex w-full justify-center items-center">
          {project.liveLink && project.liveLink !== '#' ? (
            <Button variant="default" asChild className="bg-primary hover:bg-accent hover:text-accent-foreground text-primary-foreground flex-grow transition-colors">
              <Link href={project.liveLink} target="_blank" rel="noopener noreferrer">
                <EyeIcon className="mr-2 h-4 w-4" /> Live Demo
              </Link>
            </Button>
          ) : (
             <Button variant="outline" disabled className="flex-grow">
                <EyeIcon className="mr-2 h-4 w-4" /> Live Demo
              </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
