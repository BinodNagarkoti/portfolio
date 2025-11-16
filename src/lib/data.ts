
import * as React from 'react';
import type { LucideIcon, LucideProps } from 'lucide-react';
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
import type { PersonalInfo } from './supabase-types';

// Static blog posts have been removed as this section is now database-driven.

// Fallback static data that conforms to the PersonalInfo type from Supabase
export const staticPersonalInfo: PersonalInfo = {
  id: 'static-id',
  name: 'Binod Nagarkoti',
  title: 'Frontend & Full Stack Developer',
  contact_email: 'binod1365@gmail.com',
  phone: '+9779803135946',
  location: 'Kathmandu, Nepal',
  github_url: 'https://github.com/BinodNagarkoti',
  linkedin_url: 'https://linkedin.com/in/binod-nagarkoti-496245128?utm_source=share&utm_campaign=share_via&utm_medium=android_app',
  cv_url: '/binod_nagarkoti.pdf',
  subtitle: 'Passionate about building modern web experiences.',
  bio: 'A passionate developer specializing in creating modern and performant web applications with a focus on user experience and clean code.',
  position: 'Full Stack Developer',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};
