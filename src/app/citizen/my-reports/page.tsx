
"use client"; // Convert to client component

import { useEffect, useState } from 'react';
import { IssueCard } from "@/components/citizen/issue-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Frown, AlertTriangle, Loader2 } from "lucide-react";
import type { Issue } from "@/types";
import { useUser } from "@/contexts/user-context"; // To get current user for non-mock path
import { getIssuesForUser } from '@/actions/issue-actions'; 
import { LOCAL_STORAGE_KEYS } from '@/lib/constants'; 

export default function MyReportsPage() {
  const { currentUser, loadingAuth } = useUser(); // Still needed for non-mock path and initial loading state
  const [userIssues, setUserIssues] = useState<Issue[]>([]);
  const [isLoadingIssues, setIsLoadingIssues] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const effectId = `MyReportsPage-Effect-${Date.now()}`;
    console.log(`[${effectId}] MyReportsPage effect. Mock Auth: ${process.env.NEXT_PUBLIC_USE_MOCK_AUTH}`);
    setError(null); 
    setIsLoadingIssues(true);

    if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true') {
      const mockUserUidFromStorage = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER_UID) : null;
      console.log(`[${effectId}] Mock mode. UID from Local Storage: ${mockUserUidFromStorage}`);
      
      if (!mockUserUidFromStorage) {
        console.log(`[${effectId}] Mock mode & no UID in Local Storage. Setting error.`);
        setError("You must be logged in to view your reports. (Mock mode: No user session found in local storage)");
        setIsLoadingIssues(false);
        setUserIssues([]);
        return; 
      }
      
      console.log(`[${effectId}] Mock mode & UID found (${mockUserUidFromStorage}). Fetching issues directly.`);
      getIssuesForUser(mockUserUidFromStorage)
        .then(issues => {
          console.log(`[${effectId}] Fetched ${issues.length} issues for mock user ${mockUserUidFromStorage}.`);
          setUserIssues(issues);
        })
        .catch(err => {
          console.error(`[${effectId}] Error fetching citizen issues for mock user from action:`, err);
          setError("Failed to load your reported issues for mock user. Please try again.");
        })
        .finally(() => {
          console.log(`[${effectId}] Finished fetching mock issues, setting isLoadingIssues to false.`);
          setIsLoadingIssues(false);
        });
    } else { // Firebase Auth Path (Non-mock)
      if (loadingAuth) {
        console.log(`[${effectId}] Non-mock: Auth is loading, returning for now.`);
        // isLoadingIssues is true, so loader will show.
        return;
      }

      if (!currentUser) {
        console.log(`[${effectId}] Non-mock: No currentUser from context after auth loaded. Setting error.`);
        setError("You must be logged in to view your reports.");
        setIsLoadingIssues(false);
        setUserIssues([]);
        return;
      }
      
      console.log(`[${effectId}] Non-mock: CurrentUser available (UID: ${currentUser.uid}). Fetching issues.`);
      getIssuesForUser(currentUser.uid)
        .then(issues => {
          console.log(`[${effectId}] Non-mock: Fetched ${issues.length} issues for user ${currentUser.uid}.`);
          setUserIssues(issues);
        })
        .catch(err => {
          console.error(`[${effectId}] Non-mock: Error fetching citizen issues from action:`, err);
          setError("Failed to load your reported issues. Please try again.");
        })
        .finally(() => {
          console.log(`[${effectId}] Non-mock: Finished fetching issues, setting isLoadingIssues to false.`);
          setIsLoadingIssues(false);
        });
    }
  }, [currentUser, loadingAuth]); // Dependencies:
                                 // - loadingAuth: for the non-mock path to wait for auth resolution.
                                 // - currentUser: for the non-mock path to use the UID from context.
                                 // For the mock path, this effect runs once (or if these deps change, though less relevant for mock data fetching).

  if (isLoadingIssues) { 
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
          <AlertTitle className="font-semibold">Access Denied or Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : userIssues.length === 0 ? (
        <Alert className="bg-secondary/50 border-primary/20">
          <Frown className="h-5 w-5 text-primary" />
          <AlertTitle className="text-primary font-semibold">No Reports Found</AlertTitle>
          <AlertDescription className="text-foreground/80">
            You haven&apos;t reported any issues yet. When you report an issue, it will appear here.
            {process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true' && " (Running in mock data mode with local storage)"}
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
