import { AppShell } from "@/components/layout/app-shell";
import { CITIZEN_NAV_ITEMS } from "@/lib/constants";

export default function CitizenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // In a real app, userName would come from auth state
  const userName = "Citizen User"; 
  return (
    <AppShell
      userRole="citizen"
      userName={userName}
      navItems={CITIZEN_NAV_ITEMS}
    >
      {children}
    </AppShell>
  );
}
