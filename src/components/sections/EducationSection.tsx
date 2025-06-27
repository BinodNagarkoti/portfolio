
import SectionWrapper from '@/components/common/SectionWrapper';
import { getEducation } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';

const EducationSection = async () => {
  const { data: educations } = await getEducation();

  if (!educations || educations.length === 0) {
    return null;
  }

  const formatDateRange = (start: string, end: string | null | undefined) => {
    if (!start) return '';
    const startDate = format(parseISO(start), 'MMM yyyy');
    const endDate = end ? format(parseISO(end), 'MMM yyyy') : 'Ongoing';
    return `${startDate} - ${endDate}`;
  };

  return (
    <SectionWrapper id="education" title="Education" subtitle="My Academic Background">
      <div className="relative flex flex-col gap-y-12">
        {/* Timeline Line */}
        <div className="absolute left-3 top-0 h-full w-0.5 bg-border/40 md:left-1/2 md:-translate-x-1/2"></div>
        
        {educations.map((edu, index) => (
          <div key={edu.id} className="relative pl-10 md:pl-0">
             {/* Timeline Dot */}
            <div className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 -translate-x-1/2 rounded-full bg-background border-2 border-primary md:left-1/2"></div>

            <div className="md:flex md:items-center md:justify-between">
              {/* Content Card */}
              <div className={`md:w-[calc(50%-2rem)] ${index % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
                <Card className="bg-card/50 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                        <div>
                            <CardTitle className="text-lg font-bold font-headline">{edu.degree}</CardTitle>
                            <CardDescription className='mt-1'>{edu.institution} &bull; {edu.location}</CardDescription>
                        </div>
                        <div className="text-xs text-muted-foreground whitespace-nowrap mt-1 sm:mt-0">{formatDateRange(edu.start_date!, edu.end_date)}</div>
                    </div>
                  </CardHeader>
                  {edu.description && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{edu.description}</p>
                    </CardContent>
                  )}
                </Card>
              </div>

               {/* Empty placeholder on the opposite side for desktop layout */}
               <div className={`hidden md:block md:w-[calc(50%-2rem)] ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}></div>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default EducationSection;
