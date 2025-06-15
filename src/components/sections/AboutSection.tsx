import Image from 'next/image';
import SectionWrapper from '@/components/common/SectionWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BriefcaseIcon, GraduationCapIcon, SparklesIcon } from 'lucide-react';
import { personalInfo } from '@/lib/data';

const AboutSection = () => {
  return (
    <SectionWrapper id="about" title="About Me" subtitle="My Journey">
      <div className="grid md:grid-cols-5 gap-12 items-center">
        <div className="md:col-span-2 flex justify-center md:justify-start">
          <Card className="overflow-hidden shadow-xl w-full max-w-sm transform transition-all hover:scale-105 hover:shadow-2xl">
            <Image
              src="/me.png"
              alt={personalInfo.name}
              width={400}
              height={500}
              className="object-cover w-full h-full"
              data-ai-hint="profile picture"
              priority // Adding priority for LCP improvement
            />
          </Card>
        </div>
        <div className="md:col-span-3 space-y-6">
          <h3 className="text-2xl font-semibold text-foreground font-headline">
            {personalInfo.title} from {personalInfo.location}
          </h3>
          <p className="text-lg text-muted-foreground leading-relaxed">
            I am a Bachelor of Information Technology (BIT) graduate from the College of Information Technology and Engineering (CITE), Purvanchal University (PU), Nepal. With a deep passion for web application development, I specialize in leveraging the JavaScript MERN stack (MongoDB, Express.js, React.js, Node.js) and TypeScript to build robust and scalable solutions.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            My experience spans across designing and developing diverse applications, from algorithmic trading platforms to e-commerce sites and content management systems. I thrive in dynamic environments, continuously exploring new technologies to deliver cutting-edge products.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center gap-3 pb-3">
                <GraduationCapIcon className="w-8 h-8 text-primary" />
                <CardTitle className="font-headline text-xl">Education</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">Bachelor of Information Technology (BIT)</p>
                <p className="text-sm text-muted-foreground">Purvanchal University, CITE, Nepal</p>
                <p className="text-sm text-muted-foreground">2014 – 2018</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center gap-3 pb-3">
                <BriefcaseIcon className="w-8 h-8 text-primary" />
                <CardTitle className="font-headline text-xl">Experience Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">Frontend Engineer @ Investfly</p>
                <p className="text-sm text-muted-foreground">Full Stack Developer @ Omistics Technology</p>
                <p className="text-sm text-muted-foreground">Focus on MERN, Next.js, AWS</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default AboutSection;
