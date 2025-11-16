
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import type { PersonalInfo } from '@/lib/supabase-types';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Experience', href: '#experience' },
  { name: 'Education', href: '#education' },
  { name: 'Projects', href: '#projects' },
  { name: 'Achievements', href: '#achievements' },
  { name: 'Blog', href: '#blog' },
  { name: 'Contact', href: '#contact' },
];

const Navbar = ({ personalInfo }: { personalInfo: PersonalInfo }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navStyle, setNavStyle] = useState<'stage1' | 'stage2' | 'stage3' | 'stage4' | 'stage5'>('stage1');
  
  const initials = personalInfo.name
    .split(' ')
    .map(n => n[0])
    .join('');

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const scrollableHeight = docHeight - winHeight;

      if (scrollY < 50) {
        setNavStyle('stage1');
        return;
      }
      
      if (scrollY + winHeight >= docHeight - 50) {
        setNavStyle('stage5');
        return;
      }
      
      const scrollPercentage = scrollableHeight > 0 ? scrollY / scrollableHeight : 0;

      if (scrollPercentage < 0.25) {
        setNavStyle('stage2');
      } else if (scrollPercentage < 0.5) {
        setNavStyle('stage3');
      } else if (scrollPercentage < 0.75) {
        setNavStyle('stage4');
      } else {
        setNavStyle('stage5');
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const getNavClasses = () => {
    switch (navStyle) {
      case 'stage1':
        return 'w-[90%] px-6'; // Largest
      case 'stage2':
        return 'w-[82.5%] px-5';
      case 'stage3':
        return 'w-[75%] px-4';
      case 'stage4':
        return 'w-[67.5%] px-3';
      case 'stage5':
        return 'w-[60%] px-2'; // Smallest
      default:
        return 'w-[90%] px-6';
    }
  };

  return (
    <>
      {/* Desktop Nav */}
      <nav
        className={cn(
          'hidden md:flex fixed top-4 left-1/2 -translate-x-1/2 z-40 items-center justify-between rounded-full bg-background/50 backdrop-blur-xl border border-border/20 shadow-lg transition-all duration-500 ease-in-out h-16',
          getNavClasses()
        )}
      >
        <Link
          href="#home"
          className={cn(
            "relative flex items-center justify-center text-center overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-[0_0_16px_4px_rgba(var(--accent-rgb),0.5)] ring-1 ring-border/50 bg-gradient-to-br from-primary/10 to-accent/10 hover:rotate-12",
            "h-9 w-9 text-sm"
            )}
        >
          <span className="font-bold text-foreground">{initials}</span>
        </Link>
        <div className={cn("flex items-center", "space-x-1")}>
          {navItems.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              asChild
              className={cn(
                "font-medium transition-colors duration-300 text-foreground",
                "text-sm px-3 py-2 h-9"
                )}
            >
              <Link href={item.href}>{item.name}</Link>
            </Button>
          ))}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "rounded-full transition-all duration-300 hover:scale-110",
            "h-9 w-9"
            )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-sun h-5 w-5"
          >
            <circle cx="12" cy="12" r="4"></circle>
            <path d="M12 2v2"></path>
            <path d="M12 20v2"></path>
            <path d="m4.93 4.93 1.41 1.41"></path>
            <path d="m17.66 17.66 1.41 1.41"></path>
            <path d="M2 12h2"></path>
            <path d="M20 12h2"></path>
            <path d="m6.34 17.66-1.41 1.41"></path>
            <path d="m19.07 4.93-1.41 1.41"></path>
          </svg>
        </Button>
      </nav>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[85%] bg-background/50 backdrop-blur-xl border border-border/20 rounded-full shadow-lg transition-all duration-700 ease-out">
        <div className="container mx-auto px-4 h-12">
          <div className="flex items-center justify-around h-full">
            {navItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                asChild
                className="flex flex-col items-center justify-center gap-0.5 text-sm transition-all duration-300 text-muted-foreground hover:text-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link href={item.href}>{item.name}</Link>
              </Button>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
