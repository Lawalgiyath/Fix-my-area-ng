
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import type { UserRole, UserRegistrationFormData as SignUpFormValues, MockDisplayUser, AppUser } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { registerUser } from "@/actions/user-actions"; 
import { useUser } from "@/contexts/user-context";
import { LOCAL_STORAGE_KEYS } from "@/lib/constants";


const signUpFormSchemaBase = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  moniker: z.string().min(3, { message: "Moniker must be at least 3 characters." }).max(20, { message: "Moniker cannot exceed 20 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
  gender: z.enum(["male", "female", "other"] as const, { required_error: "Please select your gender."}),
  role: z.enum(["citizen", "official"] as [UserRole, ...UserRole[]], { required_error: "Please select your user type."}),
  officialId: z.string().optional(),
  rememberMe: z.boolean().optional(),
});

const signUpFormSchema = signUpFormSchemaBase.superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });
  }
  if (data.role === "official" && (!data.officialId || data.officialId.trim() === "")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Official ID is required for government officials.",
      path: ["officialId"],
    });
  }
});


export function SignUpForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const userContext = useUser();

  const form = useForm<SignUpFormValues>({ 
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      moniker: "",
      email: "",
      password: "",
      confirmPassword: "",
      gender: undefined,
      role: "citizen",
      officialId: "",
      rememberMe: false,
    },
  });

  const userTypeValue = useWatch({ 
    control: form.control,
    name: "role",
  });

  async function onSubmit(values: SignUpFormValues) { 
    setIsLoading(true);
    toast({
      title: "Registering Account...",
      description: "Please wait.",
    });

    const registrationData: SignUpFormValues = {
        ...values,
        officialId: values.role === 'official' ? values.officialId : undefined,
    };

    const result = await registerUser(registrationData);

    if (result.success && result.firebaseUid) {
      // UID is confirmed from registration, set it for the context to use for reloading
      if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true' && typeof window !== 'undefined') {
         localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER_UID, result.firebaseUid);
      }
      
      const loadedUser: AppUser | null = await userContext.reloadUserProfile(result.firebaseUid);
      setIsLoading(false); 

      if (loadedUser) {
          // Profile successfully loaded into context AND returned by reloadUserProfile
          if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true') {
              // Use data from the loadedUser (which is sourced from local storage after registration)
              // to set the 'mockUser' for AppShell display.
              const displayUserForMock: MockDisplayUser = {
                  firstName: loadedUser.firstName,
                  lastName: loadedUser.lastName,
                  moniker: loadedUser.moniker,
                  gender: loadedUser.gender,
              };
              localStorage.setItem('mockUser', JSON.stringify(displayUserForMock));
          }

          toast({
            title: "Registration Successful!",
            description: "Redirecting to your dashboard...",
            className: "bg-green-50 border-green-200 text-green-700"
          });

          if (loadedUser.role === "citizen") {
              router.push("/citizen/dashboard");
          } else if (loadedUser.role === "official") {
              router.push("/official/dashboard");
          } else {
              // This case should ideally not happen if roles are validated at registration
               toast({
                  title: "Profile Role Issue",
                  description: `Registered, profile loaded, but role '${loadedUser.role}' is unexpected. UID: ${result.firebaseUid}. Redirecting to home.`,
                  variant: "destructive",
               });
              router.push("/"); 
          }
      } else {
           // This means registerUser saved the data, but reloadUserProfile couldn't retrieve/load it into context.
           // This is a genuine error state.
           toast({
              title: "Profile Load Failed After Registration",
              description: "Your registration data was saved, but your profile could not be loaded into the session immediately. Please try logging in.",
              variant: "destructive",
           });
          // Cleanup local storage to prevent inconsistent state
          if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true' && typeof window !== 'undefined') {
            localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_USER_UID);
            localStorage.removeItem('mockUser'); // Also remove display user if profile load failed
          }
          await userContext.logout(); // Attempt to clear any partial context state
          router.push("/"); // Redirect to login page
      }

    } else {
      setIsLoading(false);
      toast({
        title: "Registration Failed",
        description: result.error || "Could not create your account. Please check your details and try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Card className="w-full max-w-lg shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-primary">
          Create Account
        </CardTitle>
        <CardDescription className="text-center">
          Join our community of engaged citizens and officials.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="moniker"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Moniker (Username)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., JohnD" {...field} />
                  </FormControl>
                  <FormDescription>
                    This will be your unique identifier on the platform.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="yourname@example.com" {...field} />
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
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>I am a...</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="citizen">Citizen</SelectItem>
                        <SelectItem value="official">Government Official</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {userTypeValue === "official" && (
              <FormField
                control={form.control}
                name="officialId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <ShieldCheck className="mr-2 h-4 w-4 text-muted-foreground" />
                      Official ID / Verification Code
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your official identification" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormDescription>
                      This ID will be used for verification purposes (simulated for MVP).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 pt-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="rememberMeSignUp"
                    />
                  </FormControl>
                   <div className="space-y-1 leading-none">
                    <Label htmlFor="rememberMeSignUp" className="cursor-pointer">Remember me</Label>
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full !mt-6" disabled={isLoading || userContext.loadingAuth}>
              {(isLoading || userContext.loadingAuth) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
