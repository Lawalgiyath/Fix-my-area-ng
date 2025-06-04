
"use client";

import Link from "next/link";
import { SignUpForm } from "@/components/auth/signup-form";
import { APP_NAME } from "@/lib/constants";
import { UserPlus } from "lucide-react";
import { UserProvider } from "@/contexts/user-context"; // Import UserProvider

export default function SignUpPage() {
  return (
    <UserProvider> {/* Wrap content with UserProvider */}
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-primary/10 p-4">
        <header className="mb-8 text-center">
          <UserPlus className="mx-auto h-16 w-16 text-primary mb-4" />
          <h1 className="text-4xl font-extrabold text-primary tracking-tight">
            Join {APP_NAME}
          </h1>
          <p className="mt-2 text-lg text-foreground/80">
            Create your account to start making a difference.
          </p>
        </header>
        
        <SignUpForm />

        <p className="mt-8 text-center text-sm">
          Already have an account?{" "}
          <Link href="/" className="font-medium text-primary hover:underline">
            Login here
          </Link>
        </p>

        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
        </footer>
      </div>
    </UserProvider>
  );
}
