
import { IssueCard } from "@/components/citizen/issue-card";
import { MOCK_ISSUES } from "@/lib/constants"; // Will be an empty array
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ListChecks, Frown } from "lucide-react"; // Added Frown for empty state

export default function MyReportsPage() {
  // In a real app, filter issues by logged-in user
  const userIssues = MOCK_ISSUES; 

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary">My Reported Issues</h1>
      
      {userIssues.length === 0 ? (
        <Alert className="bg-secondary/50 border-primary/20">
          <Frown className="h-5 w-5 text-primary" /> {/* Changed icon */}
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
