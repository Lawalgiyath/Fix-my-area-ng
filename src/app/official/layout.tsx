import { AppShell } from "@/components/layout/app-shell";
import { OFFICIAL_NAV_ITEMS } from "@/lib/constants";

export default function OfficialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // In a real app, userName would come from auth state
  const userName = "Gov. Official"; 
  return (
    <AppShell
      userRole="official"
      userName={userName}
      navItems={OFFICIAL_NAV_ITEMS}
    >
      {children}
    </AppShell>
  );
}
