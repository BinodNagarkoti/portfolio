'use client';
import { useState, useRef } from 'react';

import {
  Code2Icon, DatabaseIcon, ServerCogIcon, CloudIcon, ContainerIcon, GitForkIcon,
  GithubIcon, ZapIcon, CpuIcon, PaletteIcon, GlobeIcon, ShieldCheckIcon, Settings2Icon,
  RouteIcon, RefreshCwIcon, CheckCheckIcon, CreditCardIcon, MousePointerClickIcon,
  Share2Icon, WindIcon, WrenchIcon
} from 'lucide-react';
import Image from 'next/image';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { JQueryIcon, FormikIcon, VercelIcon, ReactRouterIcon } from './Icons';
type TechIconType ={
   name: string;svg_icon:string; icon: LucideIcon | React.FC<React.SVGProps<SVGSVGElement>>; color?: string 
}
const techIcons: TechIconType[] = [
  { name: 'HTML', icon: Code2Icon,svg_icon:'/html.svg' },
  { name: 'CSS', icon: Code2Icon,svg_icon:'/css3.svg' },
  { name: 'Javascript', icon: Code2Icon, color: "text-yellow-400",svg_icon:'/javascript.svg' },
  { name: 'React', icon: CpuIcon, color: "text-sky-400",svg_icon:'/react.svg' },
  { name: 'JQuery', icon: JQueryIcon,svg_icon:'/jquery.svg' },
  { name: 'Node.js', icon: ServerCogIcon, color: "text-green-500",svg_icon:'/nodejs.svg' },
  { name: 'Express.js', icon: RouteIcon,svg_icon:'/express.svg' },
  { name: 'MongoDB', icon: DatabaseIcon, color: "text-green-600",svg_icon:'/mongodb.svg' },
  { name: 'MySQL', icon: DatabaseIcon,svg_icon:'/mysql.svg' },
  { name: 'GraphQL', icon: Share2Icon, color: "text-pink-500",svg_icon:'/graphql.svg' },
  { name: 'PostgreSQL', icon: DatabaseIcon, color: "text-blue-500",svg_icon:'/postgressql.svg' },
  { name: 'Google OAuth', icon: ShieldCheckIcon, color: "text-red-500",svg_icon:'/oauth.svg' },
  { name: 'Tailwind CSS', icon: WindIcon, color: "text-cyan-400",svg_icon:'tailwindcss.svg' },
  { name: 'Shadcn UI', icon: PaletteIcon,svg_icon:'/shadcnui.svg' },
  { name: 'Git', icon: GitForkIcon, color: "text-orange-500",svg_icon:'/git.svg' },
  { name: 'Github', icon: GithubIcon,svg_icon:'/github.svg' },
  { name: 'Heroku', icon: CloudIcon, color: "text-purple-500",svg_icon:'/heroku.svg' },
  { name: 'Vercel', icon: VercelIcon,svg_icon:'/vercel.svg' },
  { name: 'Next.js', icon: ZapIcon,svg_icon:'next.js.svg' },
  { name: 'TypeScript', icon: Code2Icon, color: "text-blue-400",svg_icon:'typescript.svg' },
  { name: 'Redux', icon: RefreshCwIcon, color: "text-purple-400",svg_icon:'/redux.svg' },
  { name: 'Firebase', icon: ZapIcon, color: "text-yellow-500",svg_icon:'/firebase.svg' },
  { name: 'Zod', icon: CheckCheckIcon, color: "text-blue-600",svg_icon:'/zod.svg' },
  { name: 'Khalti', icon: CreditCardIcon, color: "text-purple-600",svg_icon:'/khalti.svg' },
  { name: 'Stripe', icon: CreditCardIcon, color: "text-indigo-500",svg_icon:'/stripe.svg' },
  { name: 'AWS', icon: CloudIcon, color: "text-orange-400",svg_icon:'/aws.svg' },
  { name: 'Docker', icon: ContainerIcon, color: "text-sky-500",svg_icon:'/docker.svg' },
  { name: 'Supabase', icon: ShieldCheckIcon, color: "text-green-500",svg_icon:'/supabase.svg' },
  { name: 'Cpanel', icon: Settings2Icon,svg_icon:'/cpanel.svg' },
  { name: 'Wordpress', icon: GlobeIcon, color: "text-blue-600",svg_icon:'/wordpress.svg' },
  { name: 'WIX', icon: MousePointerClickIcon,svg_icon:'/wix.svg' },
  { name: 'Axios', icon: Code2Icon,svg_icon:'/axios.svg' },
  { name: 'React Router DOM', icon: ReactRouterIcon,svg_icon:'/react-router.svg' },
  { name: 'Formik', icon: FormikIcon,svg_icon:'/formik.svg' },
  { name: 'React Hook Form', icon: WrenchIcon,svg_icon:'/react-hook-form.svg' },
];

const chunkArray = <T,>(array: T[], size: number): T[][] => {
  const chunkedArr: T[][] = [];
  let index = 0;
  while (index < array.length) {
    chunkedArr.push(array.slice(index, size + index));
    index += size;
  }
  return chunkedArr;
};

const TechCarousel = () => {
  const iconRows = chunkArray(techIcons, 6);
  const [showCopied, setShowCopied] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  const handleIconClick = (event: React.MouseEvent<HTMLElement>, techName: string) => {
    event.stopPropagation();
    if (timer.current) {
      clearTimeout(timer.current);
    }
    setShowCopied(techName);
    timer.current = window.setTimeout(() => {
      setShowCopied(null);
    }, 2000);
  };  

  return (
    <div className="relative flex flex-col gap-4 overflow-hidden rounded-2xl bg-card/50 p-4 shadow-inner md:h-full">
      {iconRows.map((row:TechIconType[], rowIndex: number) => (
        <div
          key={rowIndex}
          className={cn(
            "flex w-max animate-marquee gap-4",
            rowIndex % 2 !== 0 && "marquee-reverse"
          )}
          style={{ '--marquee-duration': `${row.length * 6}s` } as React.CSSProperties}
        >
          {[...row, ...row].map((tech:TechIconType, techIndex: number) => {
            return (
              <div
                onClick={(event) => {
                  const svg = event.currentTarget.querySelector('svg');
                  const textArea = document.createElement('textarea');
                  textArea.value = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">${svg?.outerHTML?.replace(/style=".*?"/, '')}</svg>`;
                  document.body.appendChild(textArea);
                  textArea.select();
                  document.execCommand('copy');
                  textArea.remove();
                  handleIconClick(event,tech.name);
                }}
               key={`${rowIndex}-${techIndex}`} className="flex flex-col h-20 w-20 flex-shrink-0 items-center justify-center gap-2 rounded-2xl bg-card p-2 shadow-md backdrop-blur-sm">
                <Image
                  title={tech.name}
                  src={tech.svg_icon}
                  alt={tech.name}
                  layout="responsive"
                  width={20}
                  height={20}
                  sizes="(max-width: 768px) 10px, 20px"
                />
                <div className={cn("absolute inset-0 bg-black/70 rounded-2xl flex items-center justify-center text-white text-sm  group-hover:flex", showCopied === tech.name ?"flex text-center": "hidden")}>
                  {tech.name } SVG Copied!
                </div>
                
                
                {/* <p className="text-xs text-center text-muted-foreground font-medium truncate w-full">{tech.name}</p> */}
              </div>
            );
          })}
        </div>
      ))}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-card/50 via-transparent to-card/50"></div>
    </div>
  );
};

export default TechCarousel;
