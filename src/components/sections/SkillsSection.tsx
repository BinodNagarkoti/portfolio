import SectionWrapper from '@/components/common/SectionWrapper';
import SkillBadge from '@/components/common/SkillBadge';
import { skillsData, type SkillCategory } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const SkillsSection = () => {
  return (
    <SectionWrapper id="skills" title="My Expertise" subtitle="Technical Skills">
      <Tabs defaultValue={skillsData[0]?.name || 'frontend'} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mb-8 bg-muted/50 p-2 h-full rounded-lg">
          {skillsData.map((category) => (
            <TabsTrigger 
              key={category.name} 
              value={category.name}
              className="font-headline data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {skillsData.map((category: SkillCategory) => (
          <TabsContent key={category.name} value={category.name}>
            <Card className="bg-background/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-headline text-primary text-center md:text-left">{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                  {category.skills.map((skill) => (
                    <SkillBadge key={skill.name} skill={skill} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </SectionWrapper>
  );
};

export default SkillsSection;
