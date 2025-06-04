
"use client"; // Convert to client component

import { useEffect, useState } from 'react';
import { IssueCard } from "@/components/citizen/issue-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Frown, AlertTriangle, Loader2 } from "lucide-react";
import type { Issue } from "@/types";
import { useUser } from "@/contexts/user-context"; // To get current user
import { getIssuesForUser } from '@/actions/issue-actions'; // Use the refactored action

export default function MyReportsPage() {
  const { currentUser, loadingAuth } = useUser();
  const [userIssues, setUserIssues] = useState<Issue[]>([]);
  const [isLoadingIssues, setIsLoadingIssues] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loadingAuth) {
      // Wait for authentication to resolve
      return;
    }

    if (!currentUser) {
      setError("You must be logged in to view your reports.");
      setIsLoadingIssues(false);
      setUserIssues([]); // Clear issues if user logs out
      return;
    }
    
    setError(null); // Clear previous errors
    setIsLoadingIssues(true);

    getIssuesForUser(currentUser.uid)
      .then(issues => {
        setUserIssues(issues);
        if (issues.length === 0 && process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
            console.log("No mock issues found for user or mock data array is empty.");
        }
      })
      .catch(err => {
        console.error("Error fetching citizen issues from action:", err);
        setError("Failed to load your reported issues. Please try again.");
      })
      .finally(() => {
        setIsLoadingIssues(false);
      });

  }, [currentUser, loadingAuth]);

  if (loadingAuth || isLoadingIssues) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading your reports...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary">My Reported Issues</h1>
      
      {error ? (
        <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-700">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle className="font-semibold">Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : userIssues.length === 0 ? (
        <Alert className="bg-secondary/50 border-primary/20">
          <Frown className="h-5 w-5 text-primary" />
          <AlertTitle className="text-primary font-semibold">No Reports Found</AlertTitle>
          <AlertDescription className="text-foreground/80">
            You haven&apos;t reported any issues yet. When you report an issue, it will appear here.
            {process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' && " (Running in mock data mode)"}
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      )}
    </div>
  );
}
