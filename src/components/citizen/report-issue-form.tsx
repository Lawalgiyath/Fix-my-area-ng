"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { categorizeIssue, CategorizeIssueOutput } from "@/ai/flows/categorize-issue";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, Info, Loader2, MapPin, UploadCloud } from "lucide-react";
import { FORUM_CATEGORIES } from "@/lib/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const reportIssueSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }).max(100),
  description: z.string().min(20, { message: "Description must be at least 20 characters." }).max(1000),
  location: z.string().min(5, { message: "Location description must be at least 5 characters." }).max(200),
  categoryManual: z.string().optional(), // Optional manual category selection
  media: z.any().optional(), // Placeholder for file upload
});

export function ReportIssueForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [aiResult, setAiResult] = useState<CategorizeIssueOutput | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof reportIssueSchema>>({
    resolver: zodResolver(reportIssueSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      media: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof reportIssueSchema>) {
    setIsLoading(true);
    setAiResult(null);
    setSubmissionSuccess(false);

    try {
      const classification = await categorizeIssue({ reportContent: values.description });
      setAiResult(classification);

      // Simulate form submission to backend
      await new Promise(resolve => setTimeout(resolve, 1000)); 

      setSubmissionSuccess(true);
      toast({
        title: "Issue Reported Successfully!",
        description: (
          <div>
            <p>Your report "{values.title}" has been submitted.</p>
            <p className="mt-1">AI Category: <strong>{classification.category}</strong> (Confidence: {(classification.confidence * 100).toFixed(0)}%)</p>
          </div>
        ),
        variant: "default",
        className: "bg-green-50 border-green-200 text-green-700"
      });
      form.reset();
    } catch (error) {
      console.error("Error reporting issue or categorizing:", error);
      toast({
        title: "Error",
        description: "Could not submit or categorize the issue. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">Report a New Issue</CardTitle>
        <CardDescription>
          Help us improve our community by reporting infrastructure or service problems. 
          Provide as much detail as possible.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issue Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Broken streetlight on Elm Street" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detailed Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the issue in detail. What happened? When did you notice it? What is the impact?"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" /> Location Description
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Corner of Elm Street and Oak Avenue, opposite the bakery" {...field} />
                  </FormControl>
                  <FormDescription>
                    Provide a clear textual description of the location. You can also use nearby landmarks.
                    (Map pin-drop functionality coming soon!)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="categoryManual"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category if AI misses" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {FORUM_CATEGORIES.map(cat => (
                        <SelectItem key={cat.slug} value={cat.name}>
                          <div className="flex items-center">
                            <cat.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                            {cat.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Optionally select a category. Our AI will attempt to categorize it automatically based on your description.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="media"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                     <UploadCloud className="mr-2 h-4 w-4 text-muted-foreground" /> Attach Media (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input type="file" accept="image/*,video/*" {...field} />
                  </FormControl>
                  <FormDescription>Upload relevant photos or short videos (max 5MB). (File upload functionality is currently a placeholder)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {aiResult && !submissionSuccess && (
              <Alert variant={aiResult.confidence > 0.7 ? "default" : "destructive"} className={aiResult.confidence > 0.7 ? "bg-blue-50 border-blue-200" : "bg-orange-50 border-orange-200"}>
                <Info className="h-4 w-4" />
                <AlertTitle>AI Categorization Suggestion</AlertTitle>
                <AlertDescription>
                  Suggested Category: <strong>{aiResult.category}</strong><br />
                  Confidence: <strong>{(aiResult.confidence * 100).toFixed(0)}%</strong>
                  <p className="text-xs mt-1">If this is incorrect, you can select a category manually above before submitting.</p>
                </AlertDescription>
              </Alert>
            )}

            {submissionSuccess && (
                 <Alert variant="default" className="bg-green-50 border-green-200 text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Report Submitted!</AlertTitle>
                    <AlertDescription>
                    Thank you for your report. It has been successfully submitted.
                    {aiResult && (
                        <p className="mt-1">Final AI Category: <strong>{aiResult.category}</strong> (Confidence: {(aiResult.confidence * 100).toFixed(0)}%)</p>
                    )}
                    </AlertDescription>
              </Alert>
            )}

          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading || submissionSuccess}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {submissionSuccess ? "Report Submitted" : "Submit Report"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
