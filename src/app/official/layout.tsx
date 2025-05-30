
"use client"; // Keep as client component due to AppShell and potential auth context

import { AppShell } from "@/components/layout/app-shell";
import { OFFICIAL_NAV_ITEMS } from "@/lib/constants";

export default function OfficialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Mock user data is now handled within AppShell using localStorage for demo purposes
  return (
    <AppShell
      userRole="official"
      navItems={OFFICIAL_NAV_ITEMS}
    >
      {children}
    </AppShell>
  );
}
