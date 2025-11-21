'use client';

import SectionWrapper from '@/components/common/SectionWrapper';
import ProjectCard from '@/components/common/ProjectCard';
import { getProjects } from '@/lib/actions';
import { staticPersonalInfo } from '@/lib/data';
import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import type { PersonalInfo } from '@/lib/supabase-types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ProjectsSection = ({ personalInfo }: { personalInfo?: PersonalInfo | null }) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('professional_employment');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [availableTabs, setAvailableTabs] = useState<string[]>([]);
  
  // Drag/swipe functionality
  const [startX, setStartX] = useState<number | null>(null);
  const [startY, setStartY] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Initialize Supabase client
 const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const result = await getProjects();
        
        if (result.error) {
          setError(result.error);
        } else if (result.data) {
          setProjects(result.data);
          setFilteredProjects(result.data);
        }
      } catch (err) {
        setError('Failed to load projects');
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    // Check if user is logged in
    const checkUserSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }
    };

    fetchProjects();
    checkUserSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: any, session: any) => {
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Determine which project types have at least one project
    const projectTypes = [...new Set(projects.map(project => project.project_type))];
    setAvailableTabs(projectTypes);
    
    // If the current active tab is not available, switch to the first available tab
    if (!projectTypes.includes(activeTab) && projectTypes.length > 0) {
      setActiveTab(projectTypes[0]);
    }
    
    setFilteredProjects(projects.filter(project => project.project_type === activeTab));
  }, [projects, activeTab]);

  // Use static personal info to determine which project gets special styling.
  const featuredProjectTitle = staticPersonalInfo.name.split(' ')[0]; // e.g., 'Binod'

  // Optional: Only show projects if user is logged in
  // For public site, we'll show projects to all users
  // if (!user) {
  //   return (
  //     <SectionWrapper id="projects" title="Projects" subtitle="Projects">
  //       <div className="flex flex-col items-center justify-center py-12 text-center">
  //         <h3 className="text-xl font-semibold mb-4">Login Required</h3>
  //         <p className="mb-6">Please login to view projects</p>
 //         <Button asChild>
  //           <Link href="/admin/login">Login to View Projects</Link>
  //         </Button>
 //       </div>
  //     </SectionWrapper>
  //   );
  // }

  return (
    <section id="projects" className="py-16 md:py-24 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const currentIndex = availableTabs.indexOf(activeTab);
                const prevIndex = currentIndex - 1 >= 0 ? currentIndex - 1 : availableTabs.length - 1;
                setActiveTab(availableTabs[prevIndex]);
              }}
              className="rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="text-center flex-1 mx-4">
              <p className="text-base font-semibold uppercase tracking-wider text-primary mb-2 font-headline">
                Projects
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground font-headline">
                {activeTab === 'professional_employment' && 'Professional Employment'}
                {activeTab === 'professional_freelance' && 'Freelance'}
                {activeTab === 'personal' && 'Personal'}
              </h2>
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const currentIndex = availableTabs.indexOf(activeTab);
                const nextIndex = currentIndex + 1 < availableTabs.length ? currentIndex + 1 : 0;
                setActiveTab(availableTabs[nextIndex]);
              }}
              className="rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
          {availableTabs.length > 0 ? (
            <div className="relative">
              {/* Project content with background blended to page bg */}
              <div
                className="bg-background/50 backdrop-blur-sm rounded-xl p-6 border border-border/20"
                onTouchStart={(e) => {
                  setStartX(e.touches[0].clientX);
                  setStartY(e.touches[0].clientY);
                  setIsDragging(true);
                }}
                onTouchMove={(e) => {
                  if (!isDragging || startX === null || startY === null) return;
                  
                  const touchX = e.touches[0].clientX;
                  const touchY = e.touches[0].clientY;
                  const diffX = touchX - startX;
                  const diffY = touchY - startY;
                  
                  // Only handle horizontal swipes if the horizontal movement is greater than vertical
                  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 30) {
                    e.preventDefault();
                  }
                }}
                onTouchEnd={(e) => {
                  if (!isDragging || startX === null) return;
                  
                  const endX = e.changedTouches[0].clientX;
                  const diffX = endX - startX;
                  
                  // Swipe right (next tab)
                  if (diffX > 50) {
                    const currentIndex = availableTabs.indexOf(activeTab);
                    const prevIndex = currentIndex - 1 >= 0 ? currentIndex - 1 : availableTabs.length - 1;
                    setActiveTab(availableTabs[prevIndex]);
                  }
                  // Swipe left (prev tab)
                  else if (diffX < -50) {
                    const currentIndex = availableTabs.indexOf(activeTab);
                    const nextIndex = currentIndex + 1 < availableTabs.length ? currentIndex + 1 : 0;
                    setActiveTab(availableTabs[nextIndex]);
                  }
                  
                  setStartX(null);
                  setStartY(null);
                  setIsDragging(false);
                }}
                onMouseDown={(e) => {
                  setStartX(e.clientX);
                  setStartY(e.clientY);
                  setIsDragging(true);
                }}
                onMouseMove={(e) => {
                  if (!isDragging || startX === null || startY === null) return;
                  
                  const diffX = e.clientX - startX;
                  const diffY = e.clientY - startY;
                  
                  // Only handle horizontal drags if the horizontal movement is greater than vertical
                  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 30) {
                    // Add visual feedback here if desired
                  }
                }}
                onMouseUp={(e) => {
                  if (!isDragging || startX === null) return;
                  
                  const endX = e.clientX;
                  const diffX = endX - startX;
                  
                  // Drag right (next tab)
                  if (diffX > 50) {
                    const currentIndex = availableTabs.indexOf(activeTab);
                    const prevIndex = currentIndex - 1 >= 0 ? currentIndex - 1 : availableTabs.length - 1;
                    setActiveTab(availableTabs[prevIndex]);
                  }
                  // Drag left (prev tab)
                  else if (diffX < -50) {
                    const currentIndex = availableTabs.indexOf(activeTab);
                    const nextIndex = currentIndex + 1 < availableTabs.length ? currentIndex + 1 : 0;
                    setActiveTab(availableTabs[nextIndex]);
                  }
                  
                  setStartX(null);
                  setStartY(null);
                  setIsDragging(false);
                }}
                onMouseLeave={() => {
                  if (isDragging) {
                    setStartX(null);
                    setStartY(null);
                    setIsDragging(false);
                  }
                }}
              >
                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <p>Loading projects...</p>
                  </div>
                ) : error ? (
                  <p className="text-center text-destructive">{error}</p>
                ) : projects.filter(p => p.project_type === activeTab).length === 0 ? (
                  <p className="text-center">No {activeTab === 'professional_employment' ? 'professional employment' : activeTab === 'professional_freelance' ? 'freelance' : 'personal'} projects available</p>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.filter(p => p.project_type === activeTab).map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        cardStyle={project.title.includes(featuredProjectTitle) ? 'dark' : 'light'}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              {/* Tab indicators */}
              {/* <div className="flex justify-center mt-6 space-x-2">
                {availableTabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {tab === 'professional_employment' && 'Professional'}
                    {tab === 'professional_freelance' && 'Freelance'}
                    {tab === 'personal' && 'Personal'}
                  </button>
                ))}
              </div> */}
            </div>
          ) : (
            <div className="text-center py-8">
              <p>No projects available</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
export default ProjectsSection;
