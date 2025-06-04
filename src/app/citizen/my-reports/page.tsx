
"use client"; // Convert to client component

import { useEffect, useState } from 'react';
import { IssueCard } from "@/components/citizen/issue-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Frown, AlertTriangle, Loader2 } from "lucide-react";
import type { Issue } from "@/types";
import { useUser } from "@/contexts/user-context"; // To get current user
import { getIssuesForUser } from '@/actions/issue-actions'; // Use the refactored action
import { LOCAL_STORAGE_KEYS } from '@/lib/constants'; // Import for local storage key

export default function MyReportsPage() {
  const { currentUser, loadingAuth } = useUser();
  const [userIssues, setUserIssues] = useState<Issue[]>([]);
  const [isLoadingIssues, setIsLoadingIssues] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const effectId = `MyReportsPage-Effect-${Date.now()}`;
    console.log(`[${effectId}] MyReportsPage effect. Mock Auth: ${process.env.NEXT_PUBLIC_USE_MOCK_AUTH}, loadingAuth: ${loadingAuth}, currentUser UID: ${currentUser?.uid}`);
    setError(null); // Clear previous errors at the start of the effect
    setIsLoadingIssues(true); // Set loading true at the start

    if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true') {
      const mockUserUidFromStorage = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER_UID) : null;
      console.log(`[${effectId}] Mock mode. UID from Local Storage: ${mockUserUidFromStorage}`);
      if (!mockUserUidFromStorage) {
        console.log(`[${effectId}] Mock mode & no UID in Local Storage. Setting error.`);
        setError("You must be logged in to view your reports. (Mock mode: No user session found in local storage)");
        setIsLoadingIssues(false);
        setUserIssues([]);
        return; // Early exit if no UID in local storage for mock mode
      }
      // If UID exists in LS, UserContext should ideally reflect this in currentUser.
      // We proceed to check UserContext's loadingAuth and currentUser.
    }

    if (loadingAuth) {
      console.log(`[${effectId}] Auth is loading, returning.`);
      // Loading state is handled by the main return block based on isLoadingIssues
      return;
    }

    if (!currentUser) {
      console.log(`[${effectId}] No currentUser from context after auth loaded. Setting error.`);
      // This error message will be shown if:
      // 1. Not in mock mode and Firebase auth user is null.
      // 2. In mock mode, UID was in LS, but UserContext couldn't load/find the profile.
      setError(prevError => prevError || "You must be logged in to view your reports.");
      setIsLoadingIssues(false);
      setUserIssues([]);
      return;
    }
    
    console.log(`[${effectId}] CurrentUser available (UID: ${currentUser.uid}). Fetching issues.`);
    getIssuesForUser(currentUser.uid)
      .then(issues => {
        console.log(`[${effectId}] Fetched ${issues.length} issues for user ${currentUser.uid}.`);
        setUserIssues(issues);
        if (issues.length === 0 && process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
            console.log(`[${effectId}] No mock issues found for user or mock data array is empty.`);
        }
      })
      .catch(err => {
        console.error(`[${effectId}] Error fetching citizen issues from action:`, err);
        setError("Failed to load your reported issues. Please try again.");
      })
      .finally(() => {
        console.log(`[${effectId}] Finished fetching issues, setting isLoadingIssues to false.`);
        setIsLoadingIssues(false);
      });

  }, [currentUser, loadingAuth]); // Effect dependencies

  if (isLoadingIssues || (loadingAuth && !currentUser && process.env.NEXT_PUBLIC_USE_MOCK_AUTH !== 'true') ) {
    // Show loader if issues are loading OR if auth is loading (and not in mock mode where LS check might be primary)
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
          <AlertTitle className="font-semibold">Access Denied</AlertTitle>
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
