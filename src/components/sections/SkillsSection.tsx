import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSkillCategoriesWithSkills } from '@/lib/actions';
import type { Skill } from '@/lib/supabase-types';

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
  const frontendCategory = categories?.find(cat => cat.name === 'Frontend Development');
  const mainSkills = frontendCategory?.skills.slice(0, 8) || []; // Increased to show more skills

  return (
    <Card className="background-">
      <CardHeader>
        <CardTitle>Technical Skills</CardTitle>
      </CardHeader>
      <CardContent>
        {mainSkills.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {mainSkills.map(skill => (
              <div
                key={skill.id}
                className="flex flex-col items-center p-3 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors duration-200 border border-border/50"
              >
                <div className="w-10 h-10 mb-2 flex items-center justify-center text-primary">
                  {/* Using a generic skill icon - in a real implementation, you'd use specific icons */}
                  <span className="text-lg">💻</span>
                </div>
                <span className="text-sm font-medium text-center text-foreground">
                  {skill.name}
                </span>
                {skill.level && (
                  <div className="mt-1.5 flex">
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
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">No 'Frontend Development' skills found. Add them in the admin panel.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default SkillsSection;
