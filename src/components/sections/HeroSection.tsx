
'use client'; 

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon, CodeIcon } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '../ui/badge';
import ShinyText from '@/components/reactbits/TextAnimations/ShinyText/ShinyText';
import type { PersonalInfo } from '@/lib/supabase-types';
  
const HeroSection = ({ personalInfo }: { personalInfo: PersonalInfo }) => {
  return (
    <section id="home" className="relative min-h-[80vh] flex items-center py-20 pt-24 md:pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 order-2 md:order-1">
            <div className='space-y-4' >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary animate-in fade-in slide-in-from-bottom-4 duration-700"><span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse"></span><span className="text-sm font-medium">Hi，Iam</span></div>
            
            <div className="text-5xl sm:text-6xl lg:text-7xl font-bold">
              <ShinyText text={personalInfo.name} disabled={false} speed={3} />
              </div>
            <p className="text-2xl sm:text-3xl lg:text-4xl text-muted-foreground font-medium animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              {personalInfo.title}
            </p>
            </div>
            <p className="mt-4 max-w-lg text-lg text-muted-foreground/80 mx-auto md:mx-0">
              {personalInfo.bio}
            </p>
            <div className="flex flex-wrap gap-3 pt-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400"><span className="px-4 py-2 text-sm rounded-full bg-primary/10 text-primary border border-primary/20">React</span><span className="px-4 py-2 text-sm rounded-full bg-primary/10 text-primary border border-primary/20">Vite</span><span className="px-4 py-2 text-sm rounded-full bg-primary/10 text-primary border border-primary/20">Typescript</span></div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button size="lg" asChild>
                <Link href="#contact">
                  Contact Me
                </Link>
              </Button>
               <Button variant="outline" size="lg" asChild>
                  <Link href={'/binod_nagarkoti.pdf'} target="_blank">
                    Download CV
                  </Link>
                </Button>
            </div>
          </div>
          <div className="relative order-1 md:order-2">
            <div className="relative mx-auto w-[300px] h-[300px] lg:w-[350px] lg:h-[350px] group">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 animate-pulse"></div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-primary/10 to-transparent"></div>
              <div className="absolute inset-0 bg-card rounded-lg shadow-lg p-2">
                 <Image
                    src="/me.png"
                     alt={personalInfo.name}
                    fill
                    className="object-cover rounded-md"
                    data-ai-hint="developer illustration"
                    priority
                  />
              </div>
              <div className="absolute -bottom-6 -right-6 size-16 rounded-2xl bg-primary/10 backdrop-blur-sm flex items-center justify-center border border-primary/20 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-code-xml h-8 w-8 text-primary"><path d="m18 16 4-4-4-4"></path><path d="m6 8-4 4 4 4"></path><path d="m14.5 4-5 16"></path></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-8 sm:bottom-8 left-1/2 -translate-x-1/2 animate-bounce"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down h-6 w-6 text-muted-foreground"><path d="m6 9 6 6 6-6"></path></svg>
      </div>
    </section>
  );
};

export default HeroSection;
