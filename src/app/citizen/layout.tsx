
"use client"; // Keep as client component due to AppShell and potential auth context

import { AppShell } from "@/components/layout/app-shell";
import { CITIZEN_NAV_ITEMS } from "@/lib/constants";
import { UserProvider } from "@/contexts/user-context"; // Import UserProvider

export default function CitizenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Mock user data is now handled within AppShell using localStorage for demo purposes
  return (
    <UserProvider> {/* Wrap with UserProvider */}
      <AppShell
        userRole="citizen"
        navItems={CITIZEN_NAV_ITEMS}
      >
        {children}
      </AppShell>
    </UserProvider>
  );
}
