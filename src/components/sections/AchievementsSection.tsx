import SectionWrapper from '@/components/common/SectionWrapper';
import { getAchievements } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AwardIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const AchievementsSection = async () => {
  const { data: achievements } = await getAchievements();

  if (!achievements || achievements.length === 0) {
    return null;
  }

  const formatDate = (dateStr: string | null | undefined) => {
    return dateStr ? format(parseISO(dateStr), 'PPP') : '';
  };

  return (
    <SectionWrapper id="achievements" title="Achievements" subtitle="My Accomplishments">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {achievements.map((ach) => (
          <Card key={ach.id} className="bg-card/50 backdrop-blur-sm flex flex-col group">
            <CardHeader className="flex-row gap-4 items-center">
               <AwardIcon className="h-8 w-8 text-primary flex-shrink-0" />
               <div>
                <CardTitle>{ach.title}</CardTitle>
                {ach.date_achieved && <CardDescription>{formatDate(ach.date_achieved)}</CardDescription>}
               </div>
            </CardHeader>
            {ach.description && 
                <CardContent className="flex-grow">
                    <p className="text-muted-foreground text-sm">{ach.description}</p>
                </CardContent>
            }
          </Card>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default AchievementsSection;
