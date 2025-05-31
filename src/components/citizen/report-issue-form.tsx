
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
import { categorizeIssue, type CategorizeIssueOutput } from "@/ai/flows/categorize-issue";
import { assessIssueUrgency, type AssessIssueUrgencyOutput } from "@/ai/flows/assess-issue-urgency";
import { saveIssueReport } from "@/actions/issue-actions";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, Info, Loader2, MapPin, UploadCloud, ShieldAlert } from "lucide-react";
import { FORUM_CATEGORIES } from "@/lib/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const reportIssueSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }).max(100),
  description: z.string().min(20, { message: "Description must be at least 20 characters." }).max(1000),
  location: z.string().min(5, { message: "Location description must be at least 5 characters." }).max(200),
  categoryManual: z.string().optional(),
  media: z.custom<FileList>().optional().nullable(),
});

export function ReportIssueForm() {
  const [isProcessingAi, setIsProcessingAi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiCategorizationResult, setAiCategorizationResult] = useState<CategorizeIssueOutput | null>(null);
  const [aiUrgencyResult, setAiUrgencyResult] = useState<AssessIssueUrgencyOutput | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof reportIssueSchema>>({
    resolver: zodResolver(reportIssueSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      categoryManual: undefined,
      media: null,
    },
  });

  async function onSubmit(values: z.infer<typeof reportIssueSchema>) {
    setIsProcessingAi(true);
    setIsSubmitting(false);
    setAiCategorizationResult(null);
    setAiUrgencyResult(null);
    setSubmissionSuccess(false);
    let currentCategorization: CategorizeIssueOutput | null = null;
    let currentUrgency: AssessIssueUrgencyOutput | null = null;

    // Log selected file names (actual upload is not implemented here)
    if (values.media && values.media.length > 0) {
      const fileNames = Array.from(values.media).map(file => file.name).join(', ');
      console.log("Selected media files (names only):", fileNames);
      toast({
        title: "Media Files Selected",
        description: `Selected: ${fileNames}. (Note: Actual cloud upload is a future enhancement for this prototype.)`,
        className: "bg-blue-50 border-blue-200 text-blue-700"
      });
    }


    try {
      toast({ title: "Processing AI", description: "Analyzing your issue category and urgency..." });
      
      // Run AI flows in parallel
      const [categorization, urgencyAssessment] = await Promise.all([
        categorizeIssue({ reportContent: values.description }),
        assessIssueUrgency({ issueTitle: values.title, issueDescription: values.description })
      ]);

      currentCategorization = categorization;
      currentUrgency = urgencyAssessment;
      setAiCategorizationResult(currentCategorization);
      setAiUrgencyResult(currentUrgency);
      setIsProcessingAi(false);

      setIsSubmitting(true);
      toast({ title: "Submitting Report", description: "Saving your report..."});

      const submissionResult = await saveIssueReport(values, currentCategorization, currentUrgency);

      if (submissionResult.success) {
        setSubmissionSuccess(true);
        toast({
          title: "Issue Reported Successfully!",
          description: (
            <div>
              <p>Your report "{values.title}" submitted (ID: {submissionResult.issueId?.substring(0,6)}...).</p>
              {currentCategorization && (
                 <p className="mt-1">AI Category: <strong>{currentCategorization.category}</strong> ({(currentCategorization.confidence * 100).toFixed(0)}%)</p>
              )}
              {currentUrgency && (
                 <p className="mt-1">AI Urgency: <strong>{currentUrgency.urgency}</strong> - {currentUrgency.reasoning}</p>
              )}
            </div>
          ),
          variant: "default",
          className: "bg-green-50 border-green-200 text-green-700",
          duration: 7000,
        });
        form.reset();
        setAiCategorizationResult(null);
        setAiUrgencyResult(null);
      } else {
        throw new Error(submissionResult.error || "Failed to save report to database.");
      }

    } catch (error) {
      console.error("Error reporting issue:", error);
      const errorMessage = error instanceof Error ? error.message : "Could not submit or analyze the issue. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessingAi(false);
      setIsSubmitting(false);
    }
  }

  const isLoading = isProcessingAi || isSubmitting;

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">Report a New Issue</CardTitle>
        <CardDescription>
          Help us improve our community. Provide details and our AI will help categorize and assess urgency.
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
                    <Input placeholder="e.g., Broken streetlight on Elm Street" {...field} disabled={isLoading || submissionSuccess} />
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
                      placeholder="Describe the issue, its impact, and when you noticed it."
                      className="min-h-[120px]"
                      {...field}
                      disabled={isLoading || submissionSuccess}
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
                    <Input placeholder="e.g., Corner of Elm Street and Oak Avenue" {...field} disabled={isLoading || submissionSuccess}/>
                  </FormControl>
                  <FormDescription>
                    Provide a clear textual description of the location.
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
                  <FormLabel>Category (Optional Override)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading || submissionSuccess}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select if AI suggestion needs correction" />
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
                      <SelectItem value="Other">
                          <div className="flex items-center">
                            <Info className="mr-2 h-4 w-4 text-muted-foreground" />
                            Other
                          </div>
                        </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Our AI will suggest a category. Use this if you need to correct it.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="media"
              render={({ field: { onChange, onBlur, name, ref } }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                     <UploadCloud className="mr-2 h-4 w-4 text-muted-foreground" /> Attach Media (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      name={name}
                      onBlur={onBlur}
                      onChange={(e) => {
                        const files = e.target.files;
                        onChange(files && files.length > 0 ? files : null);
                      }}
                      ref={ref}
                      disabled={isLoading || submissionSuccess}
                    />
                  </FormControl>
                  <FormDescription>Upload photos/videos. (Note: Cloud upload is a future feature; for now, file names are logged.)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {aiCategorizationResult && !submissionSuccess && (
              <Alert variant={aiCategorizationResult.confidence > 0.7 ? "default" : "destructive"} className={aiCategorizationResult.confidence > 0.7 ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-orange-50 border-orange-200 text-orange-700"}>
                <Info className="h-4 w-4" />
                <AlertTitle>AI Category Suggestion</AlertTitle>
                <AlertDescription>
                  Category: <strong>{aiCategorizationResult.category}</strong> ({(aiCategorizationResult.confidence * 100).toFixed(0)}% confident)
                </AlertDescription>
              </Alert>
            )}
            {aiUrgencyResult && !submissionSuccess && (
                <Alert variant={aiUrgencyResult.urgency === 'Emergency' || aiUrgencyResult.urgency === 'High' ? 'destructive' : 'default'} 
                       className={aiUrgencyResult.urgency === 'Emergency' || aiUrgencyResult.urgency === 'High' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-yellow-50 border-yellow-200 text-yellow-700'}>
                    <ShieldAlert className="h-4 w-4" />
                    <AlertTitle>AI Urgency Assessment</AlertTitle>
                    <AlertDescription>
                    Urgency: <strong>{aiUrgencyResult.urgency}</strong>. Reason: {aiUrgencyResult.reasoning}
                    </AlertDescription>
                </Alert>
            )}


            {submissionSuccess && (
                 <Alert variant="default" className="bg-green-50 border-green-200 text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Report Submitted!</AlertTitle>
                    <AlertDescription>
                    Thank you for your report. It has been successfully submitted.
                    {aiCategorizationResult && (
                        <p className="mt-1">AI Category: <strong>{aiCategorizationResult.category}</strong> ({(aiCategorizationResult.confidence * 100).toFixed(0)}%)</p>
                    )}
                    {aiUrgencyResult && (
                        <p className="mt-1">AI Urgency: <strong>{aiUrgencyResult.urgency}</strong></p>
                    )}
                    </AlertDescription>
              </Alert>
            )}

          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading || submissionSuccess}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {submissionSuccess ? "Report Another Issue" : (isProcessingAi ? "Analyzing Issue..." : (isSubmitting ? "Submitting..." : "Submit Report"))}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
