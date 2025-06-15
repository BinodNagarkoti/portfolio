import type { Skill } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SkillBadgeProps {
  skill: Skill;
}

const SkillBadge = ({ skill }: SkillBadgeProps) => {
  const IconComponent = skill.icon;
  return (
    <Card className="group transform transition-all duration-300 hover:scale-105 hover:shadow-xl bg-card/80 backdrop-blur-sm border-border hover:border-primary">
      <CardContent className="p-4 flex flex-col items-center justify-center text-center aspect-square">
        <IconComponent className={cn("w-10 h-10 mb-3 text-primary transition-colors group-hover:text-accent")} />
        <h4 className="text-sm font-semibold text-foreground group-hover:text-primary">{skill.name}</h4>
        {skill.level && <p className="text-xs text-muted-foreground mt-1">{skill.level}</p>}
      </CardContent>
    </Card>
  );
};

export default SkillBadge;
