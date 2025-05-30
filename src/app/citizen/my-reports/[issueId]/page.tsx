
// src/app/citizen/my-reports/[issueId]/page.tsx
"use client";

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MOCK_ISSUES } from '@/lib/constants';
import type { Issue } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Clock, MapPin, Tag, MessageSquare, ArrowLeft, User, CalendarDays } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';

const statusConfig: Record<Issue["status"], { icon: React.ElementType; badgeClass: string; textClass: string }> = {
  Submitted: { icon: AlertCircle, badgeClass: "border-blue-500 bg-blue-50 text-blue-700", textClass: "text-blue-700" },
  "In Progress": { icon: Clock, badgeClass: "border-yellow-500 bg-yellow-50 text-yellow-700", textClass: "text-yellow-700" },
  Resolved: { icon: CheckCircle, badgeClass: "border-green-500 bg-green-50 text-green-700", textClass: "text-green-700" },
  Rejected: { icon: AlertCircle, badgeClass: "border-red-500 bg-red-50 text-red-700", textClass: "text-red-700" },
};

// Mock comments - in a real app, these would be fetched
const MOCK_COMMENTS = [
    { id: 'c1', author: 'Official Gov', text: 'Thank you for your report. We are looking into this issue.', date: '2024-07-29', userType: 'official' as const },
    { id: 'c2', author: 'Citizen A', text: 'Any updates on this? It\'s been a few days.', date: '2024-08-01', userType: 'citizen' as const },
];

export default function IssueDetailPage() {
  const params = useParams();
  const issueId = params.issueId as string;
  const issue = MOCK_ISSUES.find((iss) => iss.id === issueId);

  if (!issue) {
    return (
      <div className="container mx-auto py-8 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-semibold">Issue Not Found</h1>
        <p className="text-muted-foreground">The issue you are looking for does not exist or may have been removed.</p>
        <Button asChild variant="outline" className="mt-6">
          <Link href="/citizen/my-reports">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Reports
          </Link>
        </Button>
      </div>
    );
  }

  const CurrentStatusIcon = statusConfig[issue.status].icon;
  const currentBadgeClass = statusConfig[issue.status].badgeClass;
  const currentTextClass = statusConfig[issue.status].textClass;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Link href="/citizen/my-reports" className="inline-flex items-center text-sm text-primary hover:underline mb-4">
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to My Reports
      </Link>

      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
            <CardTitle className="text-2xl md:text-3xl font-bold text-primary">{issue.title}</CardTitle>
            <Badge variant="outline" className={`text-sm px-3 py-1 ${currentBadgeClass} self-start md:self-center`}>
              <CurrentStatusIcon className={`mr-2 h-4 w-4 ${currentTextClass}`} />
              {issue.status}
            </Badge>
          </div>
          <CardDescription className="text-sm text-muted-foreground mt-1">
            Issue ID: {issue.id}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose max-w-none dark:prose-invert">
            <p>{issue.description}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center text-muted-foreground">
              <MapPin className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
              <strong>Location:</strong> <span className="ml-1">{issue.location}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Tag className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
              <strong>Category:</strong> <span className="ml-1">{issue.category}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <User className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
              <strong>Reporter:</strong> <span className="ml-1">{issue.reporter || 'N/A'}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <CalendarDays className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
              <strong>Date Reported:</strong> <span className="ml-1">{new Date(issue.dateReported).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>

          {issue.aiClassification && (
            <div className="p-3 bg-secondary/50 rounded-md text-sm">
              <p className="font-semibold text-primary">AI Analysis:</p>
              <p className="text-muted-foreground">Suggested Category: <span className="font-medium text-foreground">{issue.aiClassification.category}</span> ({(issue.aiClassification.confidence * 100).toFixed(0)}% confidence)</p>
            </div>
          )}

          {/* Placeholder for media like images/videos */}
          {issue.media && issue.media.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2 text-primary">Attached Media</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {issue.media.map((mediaUrl, index) => (
                  <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                    <Image src={mediaUrl} alt={`Attached media ${index + 1}`} layout="fill" objectFit="cover" data-ai-hint="issue evidence" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comments Section Placeholder */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl flex items-center text-primary">
            <MessageSquare className="mr-2 h-5 w-5" /> Discussion / Updates ({MOCK_COMMENTS.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {MOCK_COMMENTS.map(comment => (
            <div key={comment.id} className={`p-4 rounded-lg border ${comment.userType === 'official' ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex justify-between items-center mb-1">
                <p className={`font-semibold text-sm ${comment.userType === 'official' ? 'text-blue-700' : 'text-gray-700'}`}>{comment.author} {comment.userType === 'official' && <Badge variant="outline" className="ml-2 border-blue-500 text-blue-600">Official</Badge>}</p>
                <p className="text-xs text-muted-foreground">{new Date(comment.date).toLocaleDateString()}</p>
              </div>
              <p className="text-sm text-foreground/90">{comment.text}</p>
            </div>
          ))}
          {MOCK_COMMENTS.length === 0 && <p className="text-sm text-muted-foreground">No comments or updates yet.</p>}
        </CardContent>
        <CardFooter className="border-t pt-4">
          <div className="w-full space-y-2">
            <Textarea placeholder="Type your comment or update here..." className="min-h-[80px]" />
            <Button className="bg-primary hover:bg-primary/80">Post Comment</Button>
            <p className="text-xs text-muted-foreground">This is a placeholder. Comments are not saved yet.</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
