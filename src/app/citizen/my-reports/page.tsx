import { IssueCard } from "@/components/citizen/issue-card";
import { MOCK_ISSUES } from "@/lib/constants";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ListChecks } from "lucide-react";

export default function MyReportsPage() {
  // In a real app, filter issues by logged-in user
  const userIssues = MOCK_ISSUES; 

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary">My Reported Issues</h1>
      
      {userIssues.length === 0 ? (
        <Alert className="bg-secondary/50">
          <ListChecks className="h-4 w-4" />
          <AlertTitle>No Reports Yet</AlertTitle>
          <AlertDescription>
            You haven&apos;t reported any issues. When you do, they will appear here.
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
