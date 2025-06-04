
import { IssueCard } from "@/components/citizen/issue-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Frown, AlertTriangle } from "lucide-react"; // Added AlertTriangle
import { db } from "@/lib/firebase-config";
import { collection, query, getDocs, orderBy, Timestamp, where } from "firebase/firestore";
import type { Issue } from "@/types";

// Helper function to convert Firestore Timestamps in an issue object to ISO strings
function processIssueTimestamps(issueData: any): Omit<Issue, 'id' | 'createdAt'> & { createdAt: string } {
  const processedData = { ...issueData };
  if (issueData.createdAt && issueData.createdAt instanceof Timestamp) {
    processedData.createdAt = issueData.createdAt.toDate().toISOString();
  }
  // dateReported should already be an ISO string from saveIssueReport action
  return processedData as Omit<Issue, 'id' | 'createdAt'> & { createdAt: string };
}

type GetIssuesResult = {
  issues: Issue[];
  errorType?: 'permission-denied' | 'other';
};

async function getCitizenIssues(): Promise<GetIssuesResult> {
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
    return { issues, errorType: undefined };
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      console.error("Firebase Permission Error in getCitizenIssues: ", error.message);
      console.error("ACTION REQUIRED: Please check your Firestore Security Rules in the Firebase console. The current rules are preventing data from being fetched for the 'issues' collection.");
      return { issues: [], errorType: 'permission-denied' };
    } else {
      console.error("Error fetching citizen issues:", error);
      return { issues: [], errorType: 'other' };
    }
  }
}

export default async function MyReportsPage() {
  const { issues: userIssues, errorType } = await getCitizenIssues();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary">My Reported Issues</h1>
      
      {errorType === 'permission-denied' ? (
        <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-700">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle className="font-semibold">Access Denied</AlertTitle>
          <AlertDescription>
            Could not fetch your reported issues due to a permission error.
            Please check your Firestore Security Rules in the Firebase console.
            The current rules are preventing data from being fetched for the 'issues' collection.
          </AlertDescription>
        </Alert>
      ) : userIssues.length === 0 ? (
        <Alert className="bg-secondary/50 border-primary/20">
          <Frown className="h-5 w-5 text-primary" />
          <AlertTitle className="text-primary font-semibold">No Reports Found</AlertTitle>
          <AlertDescription className="text-foreground/80">
            You haven&apos;t reported any issues yet.
            {errorType === 'other' && " There might have been an issue fetching your reports (check console for details)."}
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
