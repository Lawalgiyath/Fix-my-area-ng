
"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { UserRole } from "@/types";
import { APP_NAME } from "@/lib/constants";
import { Building, Users } from "lucide-react";
import { UserProvider } from "@/contexts/user-context"; // Import UserProvider

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<UserRole>("citizen");

  return (
    <UserProvider> {/* Wrap content with UserProvider */}
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-primary/10 p-4">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold text-primary tracking-tight">
            {APP_NAME}
          </h1>
          <p className="mt-2 text-lg text-foreground/80">
            Connecting citizens and government for a better Nigeria.
          </p>
        </header>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as UserRole)} className="w-full max-w-md">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="citizen" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm">
              <Users className="mr-2 h-5 w-5" /> Citizen
            </TabsTrigger>
            <TabsTrigger value="official" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm">
              <Building className="mr-2 h-5 w-5" /> Official
            </TabsTrigger>
          </TabsList>
          <TabsContent value="citizen">
            <AuthForm userType="citizen" />
          </TabsContent>
          <TabsContent value="official">
            <AuthForm userType="official" />
          </TabsContent>
        </Tabs>

        <p className="mt-6 text-center text-sm">
          New user?{" "}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </p>

        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
          <p className="mt-1">Empowering communities, enhancing governance.</p>
        </footer>
      </div>
    </UserProvider>
  );
}
