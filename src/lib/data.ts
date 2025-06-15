
import * as React from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Code2Icon,
  DatabaseIcon,
  ServerCogIcon,
  CloudIcon,
  ContainerIcon,
  GitForkIcon,
  WindIcon,
  ZapIcon,
  CpuIcon,
  PaletteIcon,
  GlobeIcon,
  ShoppingBagIcon,
  MessageSquareIcon,
  BrainIcon,
  ShieldCheckIcon,
  Settings2Icon,
  BriefcaseIcon,
  UsersIcon,
  RouteIcon,
  FilmIcon,
  BotIcon,
  CalculatorIcon
} from 'lucide-react';

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  imageUrl: string;
  imageHint: string;
  liveLink?: string;
  githubLink?: string;
  tags: string[];
}

export const projectsData: Project[] = [
  {
    id: 'investfly',
    title: 'Investfly',
    description: 'Algorithmic trading platform for stocks, options, and futures with a stock market game.',
    longDescription: 'Designed and developed a comprehensive web application for Investfly, an algorithmic trading platform. The platform supports trading in stocks, options, and futures, and includes an engaging stock market game. Key responsibilities included frontend development using ReactJS and seamless integration with REST APIs.',
    technologies: ['ReactJS', 'REST API', 'JavaScript'],
    imageUrl: 'https://www.investfly.com/images/logos/logo-white.png',
    imageHint: 'company logo',
    liveLink: '#',
    githubLink: '#',
    tags: ['FinTech', 'Trading Platform', 'Frontend']
  },
  {
    id: 'nbimf',
    title: 'nbimf.com',
    description: 'Platform for civil engineering students: blogs, BIM resources.',
    longDescription: 'Developed nbimf.com, a platform tailored for civil engineering students. It features blogs related to civil engineering and Building Information Modeling (BIM). The project involved building a customer-facing site with NextJS, an admin panel with ReactJS, and a backend using ExpressJS with MongoDB.',
    technologies: ['NextJS', 'ReactJS', 'NodeJS', 'ExpressJS', 'MongoDB', 'JavaScript'],
    imageUrl: 'https://nbimf.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FNBIMF-logo.bbba72d3.png&w=128&q=75',
    imageHint: 'company logo',
    tags: ['Civil Engineering', 'BIM', 'Full Stack', 'Content Platform']
  },
  {
    id: 'forefronteng',
    title: 'forefronteng.com',
    description: 'Portfolio with blogs, project showcases, e-commerce for civil software, and training booking.',
    longDescription: 'Led the design and development of forefronteng.com, a multi-functional portfolio site. Features include blogs, project showcases, an e-commerce section for civil engineering software sales, and a training booking application. The tech stack comprised NextJS for the frontend, ReactJS for the admin panel, and an ExpressJS backend with MySQL.',
    technologies: ['NextJS', 'ReactJS', 'NodeJS', 'ExpressJS', 'MySQL', 'JavaScript', 'E-commerce'],
    imageUrl: 'https://forefronteng.com/_next/image?url=%2Fimg%2Flogo.png&w=256&q=75',
    imageHint: 'company logo',
    liveLink: '#',
    tags: ['Portfolio', 'E-commerce', 'Full Stack', 'Civil Engineering Software']
  },
  {
    id: 'thedreamshouse',
    title: 'thedreamshouse.com',
    description: 'Real estate platform (currently under development).',
    longDescription: 'Currently spearheading the development of thedreamshouse.com, a real estate platform. This ongoing project aims to provide a modern and user-friendly experience for property searching and listing. (Details will be updated as development progresses).',
    technologies: ['NextJS', 'ReactJS', 'NodeJS', 'ExpressJS', 'PostgreSQL'],
    imageUrl: 'https://thedreamshouse.com/_next/image?url=%2Fthedreamshousepng-no-bg.png&w=1920&q=75',
    imageHint: 'company logo',
    tags: ['Real Estate', 'Full Stack', 'In Development']
  },
];

export const personalProjectsData: Project[] = [
  {
    id: 'ai-movie-suggestion',
    title: 'AI Movie Suggester',
    description: 'Get personalized movie recommendations based on your mood and preferences, powered by AI.',
    technologies: ['NextJS', 'Supabase', 'TailwindCSS', 'Genkit AI'],
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'movie cinema',
    liveLink: '#',
    githubLink: '#',
    tags: ['AI', 'Entertainment', 'Next.js', 'Supabase']
  },
  {
    id: 'ai-chat-bot',
    title: 'Intelligent AI Chat',
    description: 'A conversational AI chat application capable of understanding context and providing helpful responses.',
    technologies: ['NextJS', 'Supabase', 'TailwindCSS', 'Genkit AI'],
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'chat bubble',
    liveLink: '#',
    githubLink: '#',
    tags: ['AI', 'Chatbot', 'Next.js', 'NLP']
  },
  {
    id: 'ai-tools-suite',
    title: 'AI-Powered Utilities',
    description: 'A suite of smart tools including math solvers, color pickers, measurement converters, enhanced with AI capabilities.',
    technologies: ['NextJS', 'Supabase', 'TailwindCSS', 'Genkit AI'],
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'tools wrench',
    liveLink: '#',
    githubLink: '#',
    tags: ['AI', 'Utility Tools', 'Next.js', 'Productivity']
  }
];


export interface SkillCategory {
  name: string;
  skills: Skill[];
}

export interface Skill {
  name: string;
  icon: LucideIcon | (() => JSX.Element);
  level?: string;
}

// Custom SVG Icon Components (Simplified example)
const ReactLogo = () => { 
  return React.createElement(CpuIcon, { className: "text-sky-500" }); 
};
const NextLogo = () => { 
  return React.createElement(ZapIcon, { className: "text-neutral-900 dark:text-neutral-100" }); 
};
const TailwindLogo = () => { 
  return React.createElement(WindIcon, { className: "text-teal-500" });
};


export const skillsData: SkillCategory[] = [
  {
    name: 'Frontend Development',
    skills: [
      { name: 'HTML5', icon: Code2Icon, level: 'Expert' },
      { name: 'CSS3', icon: PaletteIcon, level: 'Expert' },
      { name: 'JavaScript (ES6+)', icon: Code2Icon, level: 'Expert' },
      { name: 'TypeScript', icon: Code2Icon, level: 'Expert' },
      { name: 'ReactJS', icon: ReactLogo, level: 'Expert' },
      { name: 'NextJS', icon: NextLogo, level: 'Expert' },
      { name: 'Tailwind CSS', icon: TailwindLogo, level: 'Expert' },
      { name: 'Material UI', icon: PaletteIcon, level: 'Intermediate' },
    ],
  },
  {
    name: 'Backend Development',
    skills: [
      { name: 'Node.js', icon: ServerCogIcon, level: 'Expert' },
      { name: 'Express.js', icon: RouteIcon, level: 'Expert' },
      { name: 'ASP.NET 8 MVC', icon: ServerCogIcon, level: 'Intermediate' },
    ],
  },
  {
    name: 'Databases & BaaS',
    skills: [
      { name: 'MongoDB', icon: DatabaseIcon, level: 'Expert' },
      { name: 'PostgreSQL', icon: DatabaseIcon, level: 'Expert' },
      { name: 'MySQL', icon: DatabaseIcon, level: 'Expert' },
      { name: 'Microsoft SQL', icon: DatabaseIcon, level: 'Intermediate' },
      { name: 'Supabase', icon: ShieldCheckIcon, level: 'Intermediate' },
      { name: 'Firebase', icon: ZapIcon, level: 'Intermediate' },
      { name: 'Redis', icon: DatabaseIcon, level: 'Basic' },
    ],
  },
  {
    name: 'Programming Languages',
    skills: [
      { name: 'Python', icon: Code2Icon, level: 'Basic' },
      { name: 'C#', icon: Code2Icon, level: 'Intermediate' },
      { name: 'PHP', icon: Code2Icon, level: 'Basic' },
    ],
  },
  {
    name: 'Tools & Platforms',
    skills: [
      { name: 'Git & GitHub', icon: GitForkIcon, level: 'Expert' },
      { name: 'Docker', icon: ContainerIcon, level: 'Intermediate' },
      { name: 'AWS (EC2, S3)', icon: CloudIcon, level: 'Intermediate' },
      { name: 'WordPress', icon: GlobeIcon, level: 'Intermediate' },
      { name: 'C-Panel', icon: Settings2Icon, level: 'Intermediate' },
      { name: 'Google OAuth', icon: ShieldCheckIcon, level: 'Intermediate' },
    ],
  },
];

export const personalInfo = {
  name: 'Binod Nagarkoti',
  title: 'Frontend & Full Stack Developer',
  email: 'binod1365@gmail.com',
  phone: '+9779803135946',
  location: 'Kathmandu, Nepal',
  github: 'https://github.com/yourusername',
  linkedin: 'https://linkedin.com/in/yourusername',
  cvLink: '/binod_nagarkoti.pdf' 
};

