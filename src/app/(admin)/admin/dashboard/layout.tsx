
'use client';

import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import {
  LayoutDashboardIcon,
  UserIcon,
  GraduationCapIcon,
  BriefcaseIcon,
  WrenchIcon,
  FolderKanbanIcon,
  MessageSquareIcon,
  SettingsIcon,
  LogOutIcon,
  CodeXmlIcon,
  PenSquareIcon,
  AwardIcon,
  StarIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { staticPersonalInfo } from '@/lib/data';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboardIcon },
  {
    label: 'Content Management',
    items: [
      { href: '/admin/dashboard/personal-info', label: 'Personal Info', icon: UserIcon },
      { href: '/admin/dashboard/education', label: 'Education', icon: GraduationCapIcon },
      { href: '/admin/dashboard/experience', label: 'Experience', icon: BriefcaseIcon },
      { href: '/admin/dashboard/skills', label: 'Skills', icon: WrenchIcon },
      { href: '/admin/dashboard/projects', label: 'Projects', icon: FolderKanbanIcon },
      { href: '/admin/dashboard/blog', label: 'Blog', icon: PenSquareIcon },
      { href: '/admin/dashboard/achievements', label: 'Achievements', icon: AwardIcon }, 
      { href: '/admin/dashboard/certifications', label: 'Certifications', icon: StarIcon },
    ],
  },
  {
    label: 'Communication',
    items: [
      { href: '/admin/dashboard/contact-submissions', label: 'Contact Submissions', icon: MessageSquareIcon },
    ],
  },
  {
    label: 'Settings',
    items: [{ href: '/admin/dashboard/site-settings', label: 'Site Settings', icon: SettingsIcon }],
  },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname();
  const [userName, setUserName] = useState<string>(staticPersonalInfo.name.split(' ')[0]);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const fetchName = async () => {
      const { data } = await supabase.from('personal_info').select('name').limit(1).single();
      if (data?.name) {
        setUserName(data.name.split(' ')[0]);
      }
    };
    const checkSession = async () => {

      const { data, error } = await supabase.auth.getSession() 
      if (error || !data?.session) return false;
      return true;
    } 
     checkSession().then((session) => {
      if (!session) {
        router.push('/admin/login');
      }
    });
    
    fetchName();
  }, []);

  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" className="border-r border-sidebar-border">
        <SidebarHeader className="p-4">
          <Link href="/admin/dashboard" className="flex items-center gap-2 text-lg font-semibold font-headline text-sidebar-primary">
            <CodeXmlIcon className="h-7 w-7" />
             <span className="group-data-[collapsible=icon]:hidden">
              {userName} Admin
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent className="p-2">
          {navItems.map((group, groupIndex) => (
            <SidebarGroup key={groupIndex} className="mb-4">
              {group.label && !group.href && (
                <SidebarGroupLabel className="text-sidebar-foreground/70">
                  {group.label}
                </SidebarGroupLabel>
              )}
              <SidebarMenu>
                {group.href ? (
                  <SidebarMenuItem key={group.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === group.href}
                      tooltip={{ children: group.label }}
                      className="data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    >
                      <Link href={group.href}>
                        <group.icon />
                        <span>{group.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ) : (
                  group.items?.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                        tooltip={{ children: item.label }}
                        className="data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      >
                        <Link href={item.href}>
                          <item.icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                )}
              </SidebarMenu>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarFooter className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <Link href="/">
                  <LogOutIcon />
                  <span>Back to Site</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-xl font-semibold">
            {navItems
              .flatMap((group) => group.items || [group])
              .find((item) => item.href === pathname)?.label || 'Dashboard'}
          </h1>
          <div>
            {/* User menu or other actions can go here */}
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
