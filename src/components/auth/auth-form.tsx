
"use client";

import type { UserRole, MockDisplayUser, AppUser } from "@/types";
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
import { loginUser } from "@/actions/user-actions"; 
import { useUser } from "@/contexts/user-context"; 
import { LOCAL_STORAGE_KEYS } from "@/lib/constants";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }), 
  rememberMe: z.boolean().optional(),
});

type AuthFormProps = {
  userType: UserRole; 
};

export function AuthForm({ userType }: AuthFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const userContext = useUser(); 

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
            // Set the UID in localStorage so UserContext.reloadUserProfile can pick it up
            localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER_UID, result.firebaseUid);
        }
      }
      
      // Call reloadUserProfile without UID, it will pick it up from localStorage or context state
      const loadedUser: AppUser | null = await userContext.reloadUserProfile(); 
      
      setIsLoading(false); 

      if (loadedUser) {
          // Save to 'mockUser' for AppShell display consistency if in mock mode, using data from loadedUser
          if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true') {
              const displayUser: MockDisplayUser = {
                  firstName: loadedUser.firstName,
                  lastName: loadedUser.lastName,
                  moniker: loadedUser.moniker,
                  gender: loadedUser.gender,
              };
              localStorage.setItem('mockUser', JSON.stringify(displayUser));
          }

          if (loadedUser.role === "citizen") {
              router.push("/citizen/dashboard");
          } else if (loadedUser.role === "official") {
              router.push("/official/dashboard");
          } else {
               toast({
                  title: "Login Role Mismatch",
                  description: `Logged in, but role ${loadedUser.role} unknown or no dashboard. UID: ${result.firebaseUid}`,
                  variant: "destructive",
               });
              router.push("/"); 
          }
      } else {
           toast({
              title: "Profile Not Found After Login",
              description: "Logged in, but profile could not be loaded into the session. Please try again or contact support.",
              variant: "destructive",
           });
           if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true') {
             localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_USER_UID);
             localStorage.removeItem('mockUser');
           }
           await userContext.logout(); 
           router.push("/");
      }
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
