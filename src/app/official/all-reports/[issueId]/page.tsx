
// This page will be a server component that fetches data,
// then can pass it to client components if needed for interactivity.
import { db } from '@/lib/firebase-config';
import type { Issue } from '@/types';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Clock, MapPin, Tag, User, CalendarDays, MessageSquare, ArrowLeft, Info, ShieldAlert, Edit, FileText, UserCheck, Users, Brain, ClipboardList } from 'lucide-react'; // Added ClipboardList
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

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


function processSingleIssueTimestamps(issueData: any): Omit<Issue, 'id'> {
  const processedData = { ...issueData };
  if (issueData.createdAt && issueData.createdAt instanceof Timestamp) {
    processedData.createdAt = issueData.createdAt.toDate().toISOString();
  }
  if (issueData.dateReported && issueData.dateReported instanceof Timestamp) {
    processedData.dateReported = issueData.dateReported.toDate().toISOString();
  }
  return processedData as Omit<Issue, 'id'>;
}


async function getIssueDetails(issueId: string): Promise<Issue | null> {
  if (!issueId) return null;
  try {
    const issueRef = doc(db, "issues", issueId);
    const issueSnap = await getDoc(issueRef);

    if (issueSnap.exists()) {
      return {
        id: issueSnap.id,
        ...processSingleIssueTimestamps(issueSnap.data()),
      } as Issue;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching issue details for official:", error);
    return null;
  }
}

export default async function OfficialIssueDetailPage({ params }: { params: { issueId: string } }) {
  const issue = await getIssueDetails(params.issueId);

  if (!issue) {
    notFound();
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
        <Link href="/official/all-reports" className="inline-flex items-center text-sm text-primary hover:underline">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to All Reports
        </Link>
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
            Issue ID: {issue.id} &bull; {statusDescription}
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
                <div><strong className="text-muted-foreground">Category (Manual):</strong> <span className="ml-1">{issue.categoryManual || 'N/A'}</span></div>
              </div>
              <div className="flex items-start">
                <User className="mr-3 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div><strong className="text-muted-foreground">Reported By (ID):</strong> <span className="ml-1 truncate">{issue.reportedById || 'N/A'}</span></div>
              </div>
              <div className="flex items-start">
                <CalendarDays className="mr-3 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div><strong className="text-muted-foreground">Date Reported:</strong> <span className="ml-1">{new Date(issue.dateReported).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span></div>
              </div>
              {issue.createdAt && (
                <div className="flex items-start md:col-span-2">
                    <FileText className="mr-3 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div><strong className="text-muted-foreground">Logged at (Server):</strong> <span className="ml-1">{new Date(issue.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span></div>
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
          <CardDescription>Manage issue status, assign tasks, and view activity log.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" disabled>
              <Edit className="mr-2 h-4 w-4" /> Update Status (Not Implemented)
            </Button>
            <Button variant="outline" disabled>
              <UserCheck className="mr-2 h-4 w-4" /> Assign (Not Implemented)
            </Button>
            <Button variant="outline" disabled>
              <Users className="mr-2 h-4 w-4" /> Escalate (Not Implemented)
            </Button>
          </div>
           <div className="mt-4 p-4 border rounded-md text-sm text-muted-foreground bg-secondary/30">
            <Info className="inline-block mr-2 h-4 w-4" />
            Activity log and commenting features are not yet implemented for officials.
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
            <p className="text-xs text-muted-foreground">Further actions will be logged here.</p>
        </CardFooter>
      </Card>
    </div>
  );
}

