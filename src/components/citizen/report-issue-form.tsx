
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
import React, { useState } from "react";
import { categorizeIssue, type CategorizeIssueOutput } from "@/ai/flows/categorize-issue";
import { assessIssueUrgency, type AssessIssueUrgencyOutput } from "@/ai/flows/assess-issue-urgency";
import { summarizeIssueDescription, type SummarizeIssueOutput } from "@/ai/flows/summarize-issue-flow";
import { saveIssueReport } from "@/actions/issue-actions";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, Info, Loader2, MapPin, UploadCloud, ShieldAlert, FileText, Paperclip } from "lucide-react";
import { FORUM_CATEGORIES } from "@/lib/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { storage } from "@/lib/firebase-config"; // Import Firebase storage instance
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Firebase storage functions

const reportIssueSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }).max(100),
  description: z.string().min(20, { message: "Description must be at least 20 characters." }).max(1000),
  location: z.string().min(5, { message: "Location description must be at least 5 characters." }).max(200),
  categoryManual: z.string().optional(),
  media: z.custom<FileList>().optional().nullable(),
});

export function ReportIssueForm() {
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [isProcessingAi, setIsProcessingAi] = useState(false);
  const [isSubmittingDb, setIsSubmittingDb] = useState(false);
  const [aiCategorizationResult, setAiCategorizationResult] = useState<CategorizeIssueOutput | null>(null);
  const [aiUrgencyResult, setAiUrgencyResult] = useState<AssessIssueUrgencyOutput | null>(null);
  const [aiSummaryResult, setAiSummaryResult] = useState<SummarizeIssueOutput | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
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
    setIsUploadingMedia(false);
    setIsProcessingAi(false);
    setIsSubmittingDb(false);
    setAiCategorizationResult(null);
    setAiUrgencyResult(null);
    setAiSummaryResult(null);
    setSubmissionSuccess(false);
    let currentCategorization: CategorizeIssueOutput | null = null;
    let currentUrgency: AssessIssueUrgencyOutput | null = null;
    let currentSummary: SummarizeIssueOutput | null = null;
    let uploadedMediaUrls: string[] = [];

    try {
      // 1. Media Upload (if any)
      if (selectedFiles.length > 0) {
        setIsUploadingMedia(true);
        toast({ title: "Uploading Media", description: `Uploading ${selectedFiles.length} file(s)...` });
        const uploadPromises = selectedFiles.map(file => {
          const filePath = `issues/${Date.now()}_${file.name}`;
          const fileRef = storageRef(storage, filePath);
          const uploadTask = uploadBytesResumable(fileRef, file);
          return new Promise<string>((resolve, reject) => {
            uploadTask.on(
              "state_changed",
              null, // We can add a progress handler here if needed
              (error) => reject(error),
              async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(downloadURL);
              }
            );
          });
        });
        uploadedMediaUrls = await Promise.all(uploadPromises);
        setIsUploadingMedia(false);
        toast({ title: "Media Uploaded", description: "All files uploaded successfully.", className: "bg-blue-50 border-blue-200 text-blue-700" });
      }

      // 2. AI Processing
      setIsProcessingAi(true);
      toast({ title: "Processing AI", description: "Analyzing issue category, urgency, and summary..." });
      
      const [categorization, urgencyAssessment, summary] = await Promise.all([
        categorizeIssue({ reportContent: values.description }),
        assessIssueUrgency({ issueTitle: values.title, issueDescription: values.description }),
        summarizeIssueDescription({ issueTitle: values.title, issueDescription: values.description })
      ]);

      currentCategorization = categorization;
      currentUrgency = urgencyAssessment;
      currentSummary = summary;
      setAiCategorizationResult(currentCategorization);
      setAiUrgencyResult(currentUrgency);
      setAiSummaryResult(currentSummary);
      setIsProcessingAi(false);

      // 3. Database Submission
      setIsSubmittingDb(true);
      toast({ title: "Submitting Report", description: "Saving your report to the database..."});

      const submissionResult = await saveIssueReport(
        { title: values.title, description: values.description, location: values.location, categoryManual: values.categoryManual },
        currentCategorization,
        currentUrgency,
        currentSummary,
        uploadedMediaUrls // Pass uploaded URLs
      );

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
              {currentSummary && (
                 <p className="mt-1 text-xs italic">AI Summary: {currentSummary.summary}</p>
              )}
              {uploadedMediaUrls.length > 0 && (
                <p className="mt-1 text-xs">{uploadedMediaUrls.length} media file(s) attached.</p>
              )}
            </div>
          ),
          variant: "default",
          className: "bg-green-50 border-green-200 text-green-700",
          duration: 9000,
        });
        form.reset();
        setSelectedFiles([]);
        setAiCategorizationResult(null);
        setAiUrgencyResult(null);
        setAiSummaryResult(null);
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
      setIsUploadingMedia(false);
      setIsProcessingAi(false);
      setIsSubmittingDb(false);
    }
  }

  const handleMediaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      // Limit to 5 files for demo purposes
      const limitedFiles = filesArray.slice(0, 5);
      setSelectedFiles(limitedFiles);
      // Create a new FileList for the form
      const dataTransfer = new DataTransfer();
      limitedFiles.forEach(file => dataTransfer.items.add(file));
      form.setValue("media", dataTransfer.files);

       if (limitedFiles.length > 0) {
        toast({
            title: "Files Selected",
            description: `${limitedFiles.length} file(s) selected. Max 5 files.`,
            className: "bg-blue-50 border-blue-200 text-blue-700",
            duration: 5000,
        });
      }
      if (filesArray.length > 5) {
        toast({
          title: "File Limit Exceeded",
          description: "You can select a maximum of 5 files. Only the first 5 were kept.",
          variant: "destructive"
        })
      }
    } else {
      setSelectedFiles([]);
      form.setValue("media", null);
    }
  };

  const isLoading = isUploadingMedia || isProcessingAi || isSubmittingDb;
  let buttonText = "Submit Report";
  if (isUploadingMedia) buttonText = "Uploading Media...";
  else if (isProcessingAi) buttonText = "Analyzing Issue...";
  else if (isSubmittingDb) buttonText = "Saving Report...";
  if (submissionSuccess) buttonText = "Report Another Issue";


  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">Report a New Issue</CardTitle>
        <CardDescription>
          Help us improve our community. Provide details, attach media (up to 5 files), and our AI will assist.
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
              render={({ field }) => ( 
                <FormItem>
                  <FormLabel className="flex items-center">
                     <UploadCloud className="mr-2 h-4 w-4 text-muted-foreground" /> Attach Media (Optional, Max 5 files)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*,video/*" 
                      multiple
                      onChange={handleMediaChange} 
                      disabled={isLoading || submissionSuccess}
                      className="block w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-primary/10 file:text-primary
                        hover:file:bg-primary/20"
                    />
                  </FormControl>
                  {selectedFiles.length > 0 && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      <p className="font-medium text-foreground">Selected files:</p>
                      <ul className="list-disc list-inside pl-4">
                        {selectedFiles.map((file, index) => (
                          <li key={index} className="truncate">
                            <Paperclip className="inline-block h-3 w-3 mr-1" />
                            {file.name} ({(file.size / 1024).toFixed(1)} KB)
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <FormDescription>Upload photos or videos to help illustrate the issue.</FormDescription>
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
             {aiSummaryResult && !submissionSuccess && (
                <Alert variant="default" className="bg-indigo-50 border-indigo-200 text-indigo-700">
                    <FileText className="h-4 w-4" />
                    <AlertTitle>AI Generated Summary</AlertTitle>
                    <AlertDescription>
                        {aiSummaryResult.summary}
                        {aiSummaryResult.confidence && ` (${(aiSummaryResult.confidence * 100).toFixed(0)}% confident)`}
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
                     {aiSummaryResult && (
                        <p className="mt-1 text-xs italic">AI Summary: {aiSummaryResult.summary}</p>
                    )}
                    </AlertDescription>
              </Alert>
            )}

          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading || submissionSuccess}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {buttonText}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
