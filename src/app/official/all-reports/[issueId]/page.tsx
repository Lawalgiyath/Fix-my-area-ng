
// This page will be a server component that fetches data,
// then can pass it to client components if needed for interactivity.
import { db } from '@/lib/firebase-config';
import type { Issue } from '@/types';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Clock, MapPin, Tag, User, CalendarDays, MessageSquare, ArrowLeft, Info, ShieldAlert, Edit, FileText, UserCheck, Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation'; // Import notFound

const statusConfig: Record<Issue["status"], { icon: React.ElementType; badgeClass: string; textClass: string; description: string }> = {
  Submitted: { icon: AlertCircle, badgeClass: "border-blue-500 bg-blue-50 text-blue-700", textClass: "text-blue-700", description: "Report has been submitted and is awaiting review." },
  "In Progress": { icon: Clock, badgeClass: "border-yellow-500 bg-yellow-50 text-yellow-700", textClass: "text-yellow-700", description: "Issue is currently being investigated or addressed." },
  Resolved: { icon: CheckCircle, badgeClass: "border-green-500 bg-green-50 text-green-700", textClass: "text-green-700", description: "Issue has been resolved." },
  Rejected: { icon: AlertCircle, badgeClass: "border-red-500 bg-red-50 text-red-700", textClass: "text-red-700", description: "Report was reviewed and rejected (e.g., duplicate, not an issue)." },
};

// Helper to convert Firestore Timestamps in a single issue object
function processSingleIssueTimestamps(issueData: any): Omit<Issue, 'id'> {
  const processedData = { ...issueData };
  if (issueData.createdAt && issueData.createdAt instanceof Timestamp) {
    processedData.createdAt = issueData.createdAt.toDate().toISOString();
  }
  // dateReported should already be an ISO string from saveIssueReport action
  // or needs similar conversion if fetched directly and is a Timestamp
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
    return null; // Or throw error to be caught by Next.js error boundary
  }
}

export default async function OfficialIssueDetailPage({ params }: { params: { issueId: string } }) {
  const issue = await getIssueDetails(params.issueId);

  if (!issue) {
    notFound(); // This will render the nearest not-found.tsx or a default Next.js 404 page
  }

  const CurrentStatusIcon = statusConfig[issue.status]?.icon || Info;
  const currentBadgeClass = statusConfig[issue.status]?.badgeClass || "border-gray-500 bg-gray-50 text-gray-700";
  const currentTextClass = statusConfig[issue.status]?.textClass || "text-gray-700";
  const statusDescription = statusConfig[issue.status]?.description || "Status undefined.";

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center justify-between">
        <Link href="/official/all-reports" className="inline-flex items-center text-sm text-primary hover:underline">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to All Reports
        </Link>
        {/* Placeholder for future actions like Print or Share */}
      </div>

      <Card className="shadow-xl">
        <CardHeader className="border-b">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
            <CardTitle className="text-2xl md:text-3xl font-bold text-primary">{issue.title}</CardTitle>
            <Badge variant="outline" className={`text-sm px-3 py-1 ${currentBadgeClass} self-start md:self-center whitespace-nowrap`}>
              <CurrentStatusIcon className={`mr-2 h-4 w-4 ${currentTextClass}`} />
              {issue.status}
            </Badge>
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
          
          <section>
            <h3 className="text-lg font-semibold text-primary mb-3">Key Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm border p-4 rounded-md">
              <div className="flex items-start">
                <MapPin className="mr-3 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div><strong className="text-muted-foreground">Location:</strong> <span className="ml-1">{issue.location}</span></div>
              </div>
              <div className="flex items-start">
                <Tag className="mr-3 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div><strong className="text-muted-foreground">Category:</strong> <span className="ml-1">{issue.categoryManual || issue.aiClassification?.category || 'N/A'}</span></div>
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

          {issue.aiClassification && (
            <section>
              <h3 className="text-lg font-semibold text-primary mb-2">AI Analysis</h3>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800">
                <p>Suggested Category: <span className="font-medium">{issue.aiClassification.category}</span></p>
                <p>Confidence: <span className="font-medium">{(issue.aiClassification.confidence * 100).toFixed(0)}%</span></p>
              </div>
            </section>
          )}
          
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
                    {/* TODO: Add lightbox functionality for images */}
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

      {/* Official Actions Section - Placeholder */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl flex items-center text-primary">
            <ShieldAlert className="mr-2 h-5 w-5" /> Official Actions & Log
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
