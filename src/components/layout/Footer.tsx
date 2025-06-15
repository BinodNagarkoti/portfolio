import Link from 'next/link';
import { GithubIcon, LinkedinIcon, MailIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { personalInfo } from '@/lib/data';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 text-muted-foreground py-8 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center space-x-4 mb-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={personalInfo.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <GithubIcon className="h-6 w-6 text-primary hover:text-accent" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <LinkedinIcon className="h-6 w-6 text-primary hover:text-accent" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href={`mailto:${personalInfo.email}`} aria-label="Email">
              <MailIcon className="h-6 w-6 text-primary hover:text-accent" />
            </Link>
          </Button>
        </div>
        <p className="text-sm">
          &copy; {currentYear} {personalInfo.name}. All rights reserved.
        </p>
        <p className="text-xs mt-1">
          Designed with <span className="text-primary">&hearts;</span> and coded with Next.js & Tailwind CSS.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
