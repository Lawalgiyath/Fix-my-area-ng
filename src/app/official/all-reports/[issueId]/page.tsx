
"use client"; // Convert to client component

import { useEffect, useState } from 'react';
import { useParams, useRouter, notFound as navigateNotFound } from 'next/navigation'; // Use navigateNotFound for client components
import Link from 'next/link';
import type { Issue } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Clock, MapPin, Tag, User, CalendarDays, MessageSquare, ArrowLeft, Info, ShieldAlert, Edit, FileText, UserCheck, Users, Brain, ClipboardList, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { getIssueById, updateIssueStatus } from '@/actions/issue-actions'; // Use refactored actions
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea'; // For official notes


const statusConfig: Record<Issue["status"], { icon: React.ElementType; badgeClass: string; textClass: string; description: string }> = {
  Submitted: { icon: AlertCircle, badgeClass: "border-blue-500 bg-blue-50 text-blue-700", textClass: "text-blue-700", description: "Report has been submitted and is awaiting review." },
  "In Progress": { icon: Clock, badgeClass: "border-yellow-500 bg-yellow-50 text-yellow-700", textClass: "text-yellow-700", description: "Issue is currently being investigated or addressed." },
  Resolved: { icon: CheckCircle, badgeClass: "border-green-500 bg-green-50 text-green-700", textClass: "text-green-700", description: "Issue has been resolved." },
  Rejected: { icon: AlertCircle, badgeClass: "border-red-500 bg-red-50 text-red-700", textClass: "text-red-700", description: "Report was reviewed and rejected (e.g., duplicate, not an issue)." },
};

const urgencyBadgeConfig: Record<NonNullable<Issue['aiUrgencyAssessment']>['urgency'], { badgeClass: string; icon?: React.ElementType }> = {
    Emergency: { badgeClass: "border-red-700 bg-red-100 text-red-800 font-bold", icon: ShieldAlert },
    High: { badgeClass: "border-orange-600 bg-orange-50 text-orange-700", icon: AlertTriangle },
    Medium: { badgeClass: "border-yellow-500 bg-yellow-50 text-yellow-700" },
    Low: { badgeClass: "border-sky-500 bg-sky-50 text-sky-700" },
    Unknown: { badgeClass: "border-gray-400 bg-gray-100 text-gray-600" },
};

export default function OfficialIssueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const issueId = params.issueId as string;
  const { toast } = useToast();

  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [officialNote, setOfficialNote] = useState(""); // For adding notes

  const fetchIssueDetails = () => {
    if (!issueId) {
      setError("Issue ID is missing.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    getIssueById(issueId)
      .then(fetchedIssue => {
        if (fetchedIssue) {
          setIssue(fetchedIssue);
          setOfficialNote(fetchedIssue.officialNotes || ""); // Load existing notes
        } else {
          setError("Issue not found.");
          // For client components, router.push or a specific "not found" component display is better.
          // navigateNotFound(); // This might be too abrupt, consider a softer error display.
        }
      })
      .catch(err => {
        console.error("Error fetching issue details:", err);
        setError("Failed to load issue details.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchIssueDetails();
  }, [issueId]);

  const handleUpdateStatus = async (newStatus: Issue["status"]) => {
    if (!issue) return;
    const result = await updateIssueStatus(issue.id, newStatus, officialNote.trim() || issue.officialNotes); // Send current note
    if (result.success) {
      toast({ title: "Status Updated", description: `Issue status changed to ${newStatus}.`, className: "bg-green-50 border-green-200 text-green-700" });
      fetchIssueDetails(); // Re-fetch to show updated data and notes
    } else {
      toast({ title: "Update Failed", description: result.error || "Could not update status.", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 text-center flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading issue details...</p>
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="container mx-auto py-8 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-semibold">Issue Not Found</h1>
        <p className="text-muted-foreground">
          {error || "The issue you are looking for does not exist or could not be loaded."}
        </p>
        <Button asChild variant="outline" className="mt-6" onClick={() => router.push('/official/all-reports')}>
          <Link href="/official/all-reports">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Reports
          </Link>
        </Button>
      </div>
    );
  }

  const CurrentStatusIcon = statusConfig[issue.status]?.icon || Info;
  const currentBadgeClass = statusConfig[issue.status]?.badgeClass || "border-gray-500 bg-gray-50 text-gray-700";
  const currentTextClass = statusConfig[issue.status]?.textClass || "text-gray-700";
  const statusDescription = statusConfig[issue.status]?.description || "Status undefined.";

  const UrgencyIcon = issue.aiUrgencyAssessment ? urgencyBadgeConfig[issue.aiUrgencyAssessment.urgency]?.icon : null;
  const urgencyBadgeClass = issue.aiUrgencyAssessment ? urgencyBadgeConfig[issue.aiUrgencyAssessment.urgency]?.badgeClass : "";


  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
      </div>

      <Card className="shadow-xl">
        <CardHeader className="border-b">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
            <CardTitle className="text-2xl md:text-3xl font-bold text-primary">{issue.title}</CardTitle>
            <div className="flex flex-col items-end gap-2 self-start md:self-center">
                <Badge variant="outline" className={`text-sm px-3 py-1 ${currentBadgeClass} whitespace-nowrap`}>
                  <CurrentStatusIcon className={`mr-2 h-4 w-4 ${currentTextClass}`} />
                  {issue.status}
                </Badge>
                {issue.aiUrgencyAssessment && (
                    <Badge variant="outline" className={`text-xs px-2 py-0.5 ${urgencyBadgeClass} whitespace-nowrap`}>
                        {UrgencyIcon && <UrgencyIcon className="mr-1.5 h-3.5 w-3.5" />}
                        AI Urgency: {issue.aiUrgencyAssessment.urgency}
                    </Badge>
                )}
            </div>
          </div>
          <CardDescription className="text-sm text-muted-foreground mt-1">
            Issue ID: {issue.id.substring(0,10)}... &bull; {statusDescription}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <section>
            <h3 className="text-lg font-semibold text-primary mb-2">Issue Description</h3>
            <div className="prose prose-sm max-w-none dark:prose-invert bg-secondary/30 p-4 rounded-md">
              <p>{issue.description}</p>
            </div>
          </section>

          {issue.aiSummary && (
            <section>
                <h3 className="text-lg font-semibold text-primary mb-2 flex items-center"><ClipboardList className="mr-2 h-5 w-5"/>AI Generated Summary</h3>
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-md text-sm text-indigo-800 italic">
                    <p>{issue.aiSummary.summary}</p>
                    {issue.aiSummary.confidence && (
                        <p className="text-xs mt-1">Confidence: {(issue.aiSummary.confidence * 100).toFixed(0)}%</p>
                    )}
                </div>
            </section>
          )}

          <section>
            <h3 className="text-lg font-semibold text-primary mb-3">Key Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm border p-4 rounded-md">
              <div className="flex items-start">
                <MapPin className="mr-3 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div><strong className="text-muted-foreground">Location:</strong> <span className="ml-1">{issue.location}</span></div>
              </div>
              <div className="flex items-start">
                <Tag className="mr-3 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div><strong className="text-muted-foreground">Category:</strong> <span className="ml-1">{issue.categoryManual || issue.aiClassification?.category || issue.category || 'N/A'}</span></div>
              </div>
              <div className="flex items-start">
                <User className="mr-3 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div><strong className="text-muted-foreground">Reported By (ID):</strong> <span className="ml-1 truncate">{issue.reportedById ? issue.reportedById.substring(0,10) + '...' : 'N/A'}</span></div>
              </div>
              <div className="flex items-start">
                <CalendarDays className="mr-3 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div><strong className="text-muted-foreground">Date Reported:</strong> <span className="ml-1">{new Date(issue.dateReported).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span></div>
              </div>
              {issue.createdAt && (
                <div className="flex items-start md:col-span-2">
                    <FileText className="mr-3 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div><strong className="text-muted-foreground">Logged at:</strong> <span className="ml-1">{new Date(issue.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span></div>
                </div>
              )}
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {issue.aiClassification && (
              <section>
                <h3 className="text-lg font-semibold text-primary mb-2 flex items-center"><Brain className="mr-2 h-5 w-5"/>AI Category Analysis</h3>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800">
                  <p>Suggested Category: <span className="font-medium">{issue.aiClassification.category}</span></p>
                  <p>Confidence: <span className="font-medium">{(issue.aiClassification.confidence * 100).toFixed(0)}%</span></p>
                </div>
              </section>
            )}
            {issue.aiUrgencyAssessment && (
              <section>
                <h3 className="text-lg font-semibold text-primary mb-2 flex items-center"><ShieldAlert className="mr-2 h-5 w-5"/>AI Urgency Assessment</h3>
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
                  <p>Assessed Urgency: <span className="font-medium">{issue.aiUrgencyAssessment.urgency}</span></p>
                  <p>Reasoning: <span className="italic">{issue.aiUrgencyAssessment.reasoning}</span></p>
                   {issue.aiUrgencyAssessment.confidence && (
                    <p>Confidence: <span className="font-medium">{(issue.aiUrgencyAssessment.confidence * 100).toFixed(0)}%</span></p>
                   )}
                </div>
              </section>
            )}
          </div>

          <section>
            <h3 className="text-lg font-semibold text-primary mb-2">Attached Media</h3>
            {(issue.mediaUrls && issue.mediaUrls.length > 0) ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
                {issue.mediaUrls.map((url, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden shadow-md border">
                    <Image
                      src={url.startsWith('http') ? url : "https://placehold.co/300x300.png"}
                      alt={`Attached media ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                      data-ai-hint="report evidence"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 border rounded-md text-sm text-muted-foreground bg-secondary/30">
                <Info className="inline-block mr-2 h-4 w-4" />
                No media was attached to this report.
              </div>
            )}
          </section>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl flex items-center text-primary">
            <Edit className="mr-2 h-5 w-5" /> Official Actions & Log
          </CardTitle>
          <CardDescription>Manage issue status, assign tasks, and add official notes.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="officialNote" className="text-sm font-medium text-primary">Official Note</Label>
            <Textarea
              id="officialNote"
              placeholder="Add internal notes or justification for status change..."
              value={officialNote}
              onChange={(e) => setOfficialNote(e.target.value)}
              className="min-h-[100px] mt-1"
            />
             <p className="text-xs text-muted-foreground mt-1">This note will be saved with the status update.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(statusConfig) as Issue["status"][]).map(statusValue => (
                <Button 
                    key={statusValue} 
                    variant={issue.status === statusValue ? "default" : "outline"}
                    onClick={() => handleUpdateStatus(statusValue)}
                    disabled={issue.status === statusValue}
                >
                    {issue.status === statusValue ? <CheckCircle className="mr-2 h-4 w-4"/> : <Edit3 className="mr-2 h-4 w-4" />}
                     Set to {statusValue}
                </Button>
            ))}
          </div>
           <div className="mt-4 p-4 border rounded-md text-sm text-muted-foreground bg-secondary/30">
            <Info className="inline-block mr-2 h-4 w-4" />
            Current official notes: {issue.officialNotes || "None"}
            <br/>
            Further actions and detailed activity log features are not yet fully implemented for officials.
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
            <p className="text-xs text-muted-foreground">Changes to notes and status are saved upon clicking a status button.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
