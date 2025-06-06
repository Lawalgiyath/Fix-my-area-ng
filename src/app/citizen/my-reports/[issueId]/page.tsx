
"use client"; // Convert to client component

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Issue, UserProfile as AppUserProfileType } from '@/types'; // Renamed to avoid conflict
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Clock, MapPin, Tag, MessageSquare, ArrowLeft, User, CalendarDays, Info, FileText, Loader2, Send } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import React, { useEffect, useState } from 'react';
import { getIssueById } from '@/actions/issue-actions'; // Use the refactored action
import { useUser } from '@/contexts/user-context'; // To get current user (optional, for author name display)

const statusConfig: Record<Issue["status"], { icon: React.ElementType; badgeClass: string; textClass: string }> = {
  Submitted: { icon: AlertCircle, badgeClass: "border-blue-500 bg-blue-50 text-blue-700", textClass: "text-blue-700" },
  "In Progress": { icon: Clock, badgeClass: "border-yellow-500 bg-yellow-50 text-yellow-700", textClass: "text-yellow-700" },
  Resolved: { icon: CheckCircle, badgeClass: "border-green-500 bg-green-50 text-green-700", textClass: "text-green-700" },
  Rejected: { icon: AlertCircle, badgeClass: "border-red-500 bg-red-50 text-red-700", textClass: "text-red-700" },
};

type DisplayComment = {
    id: string;
    author: string; // Could be moniker or "Official"
    text: string;
    date: string; // ISO string
    userType: 'official' | 'citizen';
};

export default function IssueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const issueId = params.issueId as string;
  const { toast } = useToast();
  const { currentUser: loggedInUser } = useUser(); // For comment author display

  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [displayComments, setDisplayComments] = useState<DisplayComment[]>([]);
  const [newCommentText, setNewCommentText] = useState("");

  useEffect(() => {
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
          // Mock comments load or initialize if not part of issue data yet
          // For now, keeping comments local to the session
        } else {
          setError("Issue not found.");
          toast({
            title: "Error",
            description: "The requested issue could not be found.",
            variant: "destructive",
          });
        }
      })
      .catch(err => {
        console.error("Error fetching issue details:", err);
        setError("Failed to fetch issue details.");
        toast({
          title: "Error",
          description: "Could not retrieve issue details. Please try again.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [issueId, toast]);


  const handlePostComment = () => {
    if (!newCommentText.trim()) {
      toast({
        title: "Cannot Post Empty Comment",
        description: "Please write something before posting.",
        variant: "destructive"
      });
      return;
    }

    // Determine author name based on logged-in user
    // Fallback if user context isn't fully loaded or if it's an official viewing (future enhancement)
    const authorName = loggedInUser 
        ? `${loggedInUser.firstName} (${loggedInUser.moniker || 'You'})` 
        : (issue?.reportedById === loggedInUser?.uid ? 'You (Reporter)' : 'Citizen User (You)');


    const newCommentToAdd: DisplayComment = {
      id: `comment-${Date.now()}`, // Simple ID for mock
      author: authorName,
      text: newCommentText,
      date: new Date().toISOString(),
      userType: 'citizen', // Assume citizen for now, official commenting not implemented
    };

    setDisplayComments(prevComments => [...prevComments, newCommentToAdd]);
    setNewCommentText("");

    toast({
      title: "Comment Added (Simulated)",
      description: "Your comment is visible for this session. It has not been saved permanently.",
      variant: "default",
      className: "bg-blue-50 border-blue-200 text-blue-700"
    });
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
        <Button asChild variant="outline" className="mt-6" onClick={() => router.push('/citizen/my-reports')}>
          <Link href="/citizen/my-reports">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Reports
          </Link>
        </Button>
      </div>
    );
  }

  const CurrentStatusIcon = statusConfig[issue.status]?.icon || Info;
  const currentBadgeClass = statusConfig[issue.status]?.badgeClass || "border-gray-500 bg-gray-50 text-gray-700";
  const currentTextClass = statusConfig[issue.status]?.textClass || "text-gray-700";

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Button variant="outline" size="sm" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back
      </Button>

      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
            <CardTitle className="text-2xl md:text-3xl font-bold text-primary">{issue.title}</CardTitle>
            <Badge variant="outline" className={`text-sm px-3 py-1 ${currentBadgeClass} self-start md:self-center whitespace-nowrap`}>
              <CurrentStatusIcon className={`mr-2 h-4 w-4 ${currentTextClass}`} />
              {issue.status}
            </Badge>
          </div>
          <CardDescription className="text-sm text-muted-foreground mt-1">
            Issue ID: {issue.id.substring(0,10)}...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose max-w-none dark:prose-invert">
            <p>{issue.description}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start text-muted-foreground">
              <MapPin className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div><strong>Location:</strong> <span className="ml-1">{issue.location}</span></div>
            </div>
            <div className="flex items-start text-muted-foreground">
              <Tag className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div><strong>Category:</strong> <span className="ml-1">{issue.categoryManual || issue.aiClassification?.category || issue.category || 'N/A'}</span></div>
            </div>
            <div className="flex items-start text-muted-foreground">
              <User className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div><strong>Reporter ID:</strong> <span className="ml-1 truncate">{issue.reportedById ? issue.reportedById.substring(0,10) + '...' : 'N/A'}</span></div>
            </div>
            <div className="flex items-start text-muted-foreground">
              <CalendarDays className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div><strong>Date Reported:</strong> <span className="ml-1">{new Date(issue.dateReported).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span></div>
            </div>
             {issue.createdAt && (
                <div className="flex items-start text-muted-foreground md:col-span-2">
                    <FileText className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div><strong>Logged at:</strong> <span className="ml-1">{new Date(issue.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span></div>
                </div>
            )}
          </div>

          {issue.aiClassification && (
            <div className="p-3 bg-secondary/50 rounded-md text-sm">
              <p className="font-semibold text-primary">AI Analysis:</p>
              <p className="text-muted-foreground">Suggested Category: <span className="font-medium text-foreground">{issue.aiClassification.category}</span> ({(issue.aiClassification.confidence * 100).toFixed(0)}% confidence)</p>
            </div>
          )}
          
          <div>
            <h3 className="text-lg font-semibold mb-2 text-primary">Attached Media</h3>
            {(issue.mediaUrls && issue.mediaUrls.length > 0) ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
                {issue.mediaUrls.map((url, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden shadow-md">
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
              <p className="text-sm text-muted-foreground">No media was attached to this report.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl flex items-center text-primary">
            <MessageSquare className="mr-2 h-5 w-5" /> Discussion / Updates ({displayComments.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {displayComments.length === 0 && <p className="text-sm text-muted-foreground">No comments or updates yet for this issue. Be the first to comment!</p>}
          {displayComments.map(comment => (
            <div key={comment.id} className={`p-4 rounded-lg border ${comment.userType === 'official' ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex justify-between items-center mb-1">
                <p className={`font-semibold text-sm ${comment.userType === 'official' ? 'text-blue-700' : 'text-gray-700'}`}>{comment.author} {comment.userType === 'official' && <Badge variant="outline" className="ml-2 border-blue-500 text-blue-600">Official</Badge>}</p>
                <p className="text-xs text-muted-foreground">{new Date(comment.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <p className="text-sm text-foreground/90 whitespace-pre-wrap">{comment.text}</p>
            </div>
          ))}
        </CardContent>
        <CardFooter className="border-t pt-4">
          <div className="w-full space-y-2">
            <Textarea 
                placeholder="Type your comment or update here..." 
                className="min-h-[80px]" 
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
            />
            <Button className="bg-primary hover:bg-primary/80" onClick={handlePostComment}>
                <Send className="mr-2 h-4 w-4" /> Post Comment
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
