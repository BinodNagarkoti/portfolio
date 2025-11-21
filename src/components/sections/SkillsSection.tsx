import { getSkillCategoriesWithSkills } from '@/lib/actions';
import type { Skill, SkillCategoryWithSkills } from '@/lib/supabase-types';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const skillToProgress = (skill: Skill) => {
  switch (skill.level) {
    case 'Expert': return 95;
    case 'Intermediate': return 75;
    case 'Basic': return 50;
    default: return 0;
  }
};

const SkillsSection = async () => {
  const { data: categories } = await getSkillCategoriesWithSkills();

  return (
    <section className="w-full py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Technical Skills</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            My expertise organized by category
          </p>
        </div>
        
        {categories && categories.length > 0 ? (
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {categories.map((category: SkillCategoryWithSkills) => (
                <AccordionItem
                  key={category.id}
                  value={`category-${category.id}`}
                  className="border rounded-xl bg-card overflow-hidden transition-all duration-200"
                >
                  <AccordionTrigger className="px-5 py-4 text-lg font-semibold hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <span className="text-lg">🔧</span>
                      </div>
                      <span>{category.name}</span>
                      <Badge variant="secondary" className="ml-auto">
                        {category.skills.length} skills
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-2">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {category.skills.map((skill: Skill) => (
                        <div
                          key={skill.id}
                          className="flex flex-col items-center p-3 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-all duration-200 border border-border/50 group"
                        >
                          <div className="w-10 h-10 mb-2 flex items-center justify-center text-primary rounded-full group-hover:bg-primary/10 transition-colors duration-200">
                            <span className="text-lg">💻</span>
                          </div>
                          <span className="text-sm font-medium text-center text-foreground mb-1">
                            {skill.name}
                          </span>
                          {skill.level && (
                            <div className="flex">
                              {/* Visual indicator for skill level */}
                              {[...Array(3)].map((_, i) => {
                                const levelValue = skill.level === 'Expert' ? 3 : skill.level === 'Intermediate' ? 2 : 1;
                                return (
                                  <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full mx-0.5 ${
                                      i < levelValue ? 'bg-primary' : 'bg-muted'
                                    }`}
                                  />
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-base text-muted-foreground">No skills found. Add them in the admin panel.</p>
          </div>
        )}
      </div>
    </section>
 );
};

export default SkillsSection;
