
import SectionWrapper from '@/components/common/SectionWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getSkillCategoriesWithSkills } from '@/lib/actions';
import type { Skill } from '@/lib/supabase-types';

const skillToProgress = (skill: Skill) => {
  switch (skill.level) {
    case 'Expert': return 95;
    case 'Intermediate': return 75;
    case 'Basic': return 50;
    default: return 0;
  }
}

const AboutSection = async () => {
  const { data: categories } = await getSkillCategoriesWithSkills();
  const frontendCategory = categories?.find(cat => cat.name === 'Frontend Development');
  const mainSkills = frontendCategory?.skills.slice(0, 4) || [];

  return (
    <SectionWrapper id="about" title="About Me" subtitle="">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Professional Background</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
            I am a full-stack developer who focuses on the NodeJS(ExpressJS) backend and is familiar with core technologies such as Postgres, MySQL, NoSQL(MongoDB) Redis and can build high-performance, maintainable server-side architectures. At the same time, I have good front-end development capabilities and can build highly interactive web applications using modern frameworks such as ReactJS, NextJs, and Vite. I focus on product experience and design details, and am committed to creating products that combine technical depth and user value.</p>
           
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Technical Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {mainSkills.length > 0 ? mainSkills.map(skill => (
              <div key={skill.id}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-sm text-foreground">{skill.name}</span>
                  <span className="text-xs text-muted-foreground">{skillToProgress(skill)}%</span>
                </div>
                <Progress value={skillToProgress(skill)} />
              </div>
            )) : (
              <p className="text-sm text-muted-foreground">No 'Frontend Development' skills found. Add them in the admin panel.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </SectionWrapper>
  );
};

export default AboutSection;
