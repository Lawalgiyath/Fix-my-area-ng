"use client";

import type { NavItem, UserRole } from "@/types";
import { APP_NAME, USER_MENU_NAV_ITEMS } from "@/lib/constants";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LogOut, Menu, ChevronDown } from "lucide-react";
import React from "react";

type AppShellProps = {
  userRole: UserRole;
  userName: string; // Mocked for now
  navItems: NavItem[];
  children: React.ReactNode;
};

export function AppShell({ userRole, userName, navItems, children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const getPageTitle = () => {
    const currentNavItem = navItems.find(item => pathname === item.href || (item.matchStartsWith && pathname.startsWith(item.href)));
    if (currentNavItem) return currentNavItem.title;
    if (pathname.includes('/forum/')) return "Forum Discussion"; // Example for dynamic sub-pages
    return APP_NAME;
  };

  const handleLogout = () => {
    // Simulate logout
    router.push('/');
  };
  
  const UserAvatar = () => (
    <Avatar className="h-9 w-9">
      <AvatarImage src={`https://placehold.co/100x100.png?text=${userName.charAt(0)}`} alt={userName} data-ai-hint="user avatar" />
      <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  );

  return (
    <SidebarProvider defaultOpen>
      <SidebarHSN navItems={navItems} userRole={userRole} userName={userName} onLogout={handleLogout} pageTitle={getPageTitle()} />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <div className="flex items-center gap-2 md:hidden">
            <SidebarTrigger />
          </div>
          <h1 className="text-xl font-semibold hidden md:block">{getPageTitle()}</h1>
          <div className="relative ml-auto flex-1 md:grow-0">
            {/* Optional: Search bar here */}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="group flex items-center gap-x-2.5 rounded-full px-3 py-2 text-sm font-medium hover:bg-muted/50"
              >
                <UserAvatar />
                <span className="hidden md:block">{userName}</span>
                <ChevronDown className="hidden h-4 w-4 text-muted-foreground transition-transform duration-300 group-data-[state=open]:rotate-180 md:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex flex-col">
                <span>{userName}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {USER_MENU_NAV_ITEMS.map((item) => (
                <DropdownMenuItem key={item.title} asChild className="cursor-pointer">
                  {item.href === '/' ? (
                     <button onClick={handleLogout} className="w-full text-left flex items-center">
                       <item.icon className="mr-2 h-4 w-4" />
                       {item.title}
                     </button>
                  ) : (
                    <Link href={item.href} className="flex items-center">
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.title}
                    </Link>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}


// Helper component HSN (Headless Sidebar Navigation)
// This is based on the structure from shadcn/ui sidebar component example
const SidebarHSN = ({ navItems, userRole, userName, onLogout, pageTitle }: { navItems: NavItem[], userRole: string, userName: string, onLogout: () => void, pageTitle: string }) => {
  const pathname = usePathname();
  
  const UserAvatar = () => (
    <Avatar className="h-8 w-8">
      <AvatarImage src={`https://placehold.co/100x100.png?text=${userName.charAt(0)}`} alt={userName} data-ai-hint="user avatar" />
      <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarRail />
      <SidebarHeader className="p-2">
        <div className="flex items-center justify-between group-data-[collapsible=icon]:justify-center">
            <Link href={userRole === 'citizen' ? '/citizen/dashboard' : '/official/dashboard'} className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="h-6 w-6 text-primary fill-current"><rect width="256" height="256" fill="none"/><path d="M148,164.41,127.78,128,148,91.59A8,8,0,0,0,142.22,80H64a8,8,0,0,0-8,8V168a8,8,0,0,0,8,8H142.22a8,8,0,0,0,5.73-13.59Z" opacity="0.2"/><path d="M224,48H184V40a16,16,0,0,0-16-16H56A16,16,0,0,0,40,40V184a16,16,0,0,0,16,16H87.25l21.34,39.13a8,8,0,0,0,13.86,0L144,199.77V200a16,16,0,0,0,16,16h56a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48ZM56,40h96V56H56ZM148,164.41,127.78,128,148,91.59A8,8,0,0,0,142.22,80H64a8,8,0,0,0-8,8V168a8,8,0,0,0,8,8H142.22a8,8,0,0,0,5.73-13.59ZM224,200H160V72h64Z"/></svg>
                <span className="text-lg font-semibold">{APP_NAME}</span>
            </Link>
            <SidebarTrigger className="hidden md:flex group-data-[collapsible=icon]:hidden" />
        </div>
         {/* Mobile header inside sidebar drawer */}
        <div className="my-2 flex items-center justify-between border-b pb-2 md:hidden">
            <h1 className="text-lg font-semibold">{pageTitle}</h1>
            <SidebarTrigger />
        </div>
        <div className="flex items-center gap-2 border-b pb-2 pt-1 md:hidden">
            <UserAvatar/>
            <div>
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground">{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</p>
            </div>
        </div>
      </SidebarHeader>
      <ScrollArea className="flex-1">
        <SidebarContent className="p-2">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href || (item.matchStartsWith && pathname.startsWith(item.href))}
                  tooltip={{ children: item.title, className:"bg-primary text-primary-foreground" }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </ScrollArea>
      <SidebarFooter className="p-2 border-t">
         {/* Desktop footer: logout button */}
        <div className="hidden md:block">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={onLogout} tooltip={{ children: "Logout", className:"bg-primary text-primary-foreground"  }}>
                <LogOut />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
         {/* Mobile footer: logout button */}
        <div className="md:hidden">
          <Button variant="ghost" className="w-full justify-start gap-2" onClick={onLogout}>
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
