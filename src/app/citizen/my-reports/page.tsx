
import { IssueCard } from "@/components/citizen/issue-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Frown } from "lucide-react";
import { db } from "@/lib/firebase-config";
import { collection, query, getDocs, orderBy, Timestamp, where } from "firebase/firestore";
import type { Issue } from "@/types";

// Helper function to convert Firestore Timestamps in an issue object to ISO strings
// This is important for serialization when passing data from Server Components to Client Components
// or when data might be stringified (e.g., in props).
function processIssueTimestamps(issueData: any): Omit<Issue, 'id' | 'createdAt'> & { createdAt: string } {
  const processedData = { ...issueData };
  if (issueData.createdAt && issueData.createdAt instanceof Timestamp) {
    processedData.createdAt = issueData.createdAt.toDate().toISOString();
  }
  // dateReported should already be an ISO string from saveIssueReport action
  return processedData as Omit<Issue, 'id' | 'createdAt'> & { createdAt: string };
}


async function getCitizenIssues(): Promise<Issue[]> {
  try {
    const issuesCollectionRef = collection(db, "issues");
    
    // TODO: Once authentication is implemented, filter by the current user's ID
    // const currentUserId = "mock_citizen_user_id"; // Replace with actual authenticated user ID
    // const q = query(issuesCollectionRef, where("reportedById", "==", currentUserId), orderBy("createdAt", "desc"));
    
    // For now, fetching all issues for demonstration
    const q = query(issuesCollectionRef, orderBy("createdAt", "desc"));
    
    const querySnapshot = await getDocs(q);
    const issues: Issue[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      issues.push({
        id: doc.id,
        ...processIssueTimestamps(data),
      } as Issue);
    });
    return issues;
  } catch (error) {
    console.error("Error fetching citizen issues:", error);
    return []; // Return empty array on error
  }
}

export default async function MyReportsPage() {
  const userIssues = await getCitizenIssues();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary">My Reported Issues</h1>
      
      {userIssues.length === 0 ? (
        <Alert className="bg-secondary/50 border-primary/20">
          <Frown className="h-5 w-5 text-primary" />
          <AlertTitle className="text-primary font-semibold">No Reports Found</AlertTitle>
          <AlertDescription className="text-foreground/80">
            You haven&apos;t reported any issues yet, or there are no issues matching the current filters.
            When you report an issue, it will appear here.
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
