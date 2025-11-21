
'use client';

import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { Separator } from "@/components/ui/separator"

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
    <SidebarProvider defaultOpen  style={
        {
          "--sidebar-width": "20rem",
          "--header-height": "4rem",

        } as React.CSSProperties
      }>
      <Sidebar variant="sidebar" collapsible="none"
      >
        <SidebarHeader className="p-4 border-b border-sidebar-border">
          <Link href="/admin/dashboard" className="flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent transition-colors duration-200">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <CodeXmlIcon className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold font-headline text-sidebar-primary group-data-[collapsible=icon]:hidden">
                {userName}
              </span>
              <span className="text-xs font-medium text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden">
                Admin Panel
              </span>
            </div>
          </Link>
        </SidebarHeader>
        <SidebarContent className="p-3">
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
                      className="data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg transition-colors duration-200"
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
                        className="data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg transition-colors duration-200"
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
        <SidebarFooter className="p-2 mt-96">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="text-red-600 hover:bg-red-50 hover:text-red-700 data-[active=true]:bg-red-100 data-[active=true]:text-red-700 rounded-lg transition-colors duration-200 border border-red-200"
              >
                <Link href="/">
                  <LogOutIcon className="text-red-600" />
                  <span className="text-red-600 font-medium">Back to Site</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <div className="flex flex-col flex-1 overflow-hidden">
    {/* <header className="sticky top-0 z-10 flex h-[--header-height] shrink-0 items-center gap-2 border-b bg-background/90 backdrop-blur-sm transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-[--header-height]">
               <div className="flex w-full items-center gap-2 px-4 lg:gap-4 lg:px-6">

           <SidebarTrigger className="mr-1" />
             <Separator
          orientation="vertical"
           className="mx-1 data-[orientation=vertical]:h-6"
         />
           <h1 className="text-2xl font-bold tracking-tight">
             {navItems
               .flatMap((group) => group.items || [group])
               .find((item) => item.href === pathname)?.label || 'Dashboard'}
           </h1>
           <div className="ml-auto flex items-center gap-2">
             {/* User menu or other actions can go here */}
            {/* </div>
           </div>
         </header> */}
         <main className="flex flex-1 flex-col overflow-auto">
           <div className="@container/main flex flex-1 flex-col gap-2">
             <div className="flex flex-col gap-4 py-6 px-4 md:gap-6 md:py-8 md:px-6">
               {children}
             </div>
           </div>
         </main>
       </div>
    </SidebarProvider>
  );
}
