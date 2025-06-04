
"use client";

import type { UserRole, MockRegisteredUser } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { loginUser } from "@/actions/user-actions"; // Import the action
import { useUser } from "@/contexts/user-context"; // Import useUser to trigger reload
import { LOCAL_STORAGE_KEYS } from "@/lib/constants";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }), // Min 1 for mock flexibility
  rememberMe: z.boolean().optional(),
});

type AuthFormProps = {
  userType: UserRole; // This prop might become less relevant if role is derived from mock user
};

export function AuthForm({ userType }: AuthFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const userContext = useUser(); // Get user context

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    toast({
      title: "Attempting Login...",
      description: "Please wait.",
    });

    const result = await loginUser(values.email, values.password);

    if (result.success && result.firebaseUid) {
      toast({
        title: "Authentication Succeeded",
        description: "Verifying profile and redirecting...",
        className: "bg-green-50 border-green-200 text-green-700"
      });

      if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true') {
        if (typeof window !== 'undefined') {
            localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER_UID, result.firebaseUid);
        }
      }
      
      // Trigger profile reload in UserContext
      // The UserContext's onAuthStateChanged (for Firebase) or its mock equivalent
      // should pick up the new auth state and fetch the profile.
      // We explicitly call reloadUserProfile to ensure it happens for mock flow.
      await userContext.reloadUserProfile(result.firebaseUid); 

      // Wait for userContext to update, then check role for redirection
      // This part is tricky as context update is async. A better way might be needed.
      // For now, a small delay and then check.
      setTimeout(() => {
        setIsLoading(false);
        const loggedInUser = userContext.currentUser; // Re-check current user from context
        
        if (loggedInUser) {
            if (loggedInUser.role === "citizen") {
                router.push("/citizen/dashboard");
            } else if (loggedInUser.role === "official") {
                router.push("/official/dashboard");
            } else {
                 toast({
                    title: "Login Role Mismatch",
                    description: `Logged in, but role ${loggedInUser.role} unknown or no dashboard. UID: ${result.firebaseUid}`,
                    variant: "destructive",
                 });
                router.push("/"); // Fallback to home
            }
        } else {
             toast({
                title: "Profile Not Found",
                description: "Logged in, but profile could not be loaded. Please try again or contact support.",
                variant: "destructive",
             });
             // Log out the user if profile isn't found after login
             userContext.logout();
             router.push("/");
        }
      }, 1000); // Delay to allow context to potentially update

    } else {
      setIsLoading(false);
      toast({
        title: "Login Failed",
        description: result.error || "Invalid credentials or user role mismatch.",
        variant: "destructive",
      });
    }
  }

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-primary">
          {userType === "citizen" ? "Citizen Login" : "Official Login"}
        </CardTitle>
        <CardDescription className="text-center">
          Access your {userType} portal.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="yourname@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="rememberMeLogin"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <Label htmlFor="rememberMeLogin" className="cursor-pointer">Remember me</Label>
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading || userContext.loadingAuth}>
              {(isLoading || userContext.loadingAuth) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
