
import type { Issue } from "@/types";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Clock, MapPin, MessageSquare, Tag } from "lucide-react";

type IssueCardProps = {
  issue: Issue;
};

const statusConfig = {
  Submitted: { icon: AlertCircle, color: "bg-blue-500 hover:bg-blue-600", text: "text-blue-500" },
  "In Progress": { icon: Clock, color: "bg-yellow-500 hover:bg-yellow-600", text: "text-yellow-500" },
  Resolved: { icon: CheckCircle, color: "bg-green-500 hover:bg-green-600", text: "text-green-500" },
  Rejected: { icon: AlertCircle, color: "bg-red-500 hover:bg-red-600", text: "text-red-500" },
};

export function IssueCard({ issue }: IssueCardProps) {
  const currentStatusConfig = statusConfig[issue.status];

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-semibold text-primary line-clamp-2">{issue.title}</CardTitle>
          <Badge variant="outline" className={`border-current ${currentStatusConfig.text} flex-shrink-0 ml-2`}>
            <currentStatusConfig.icon className={`mr-1.5 h-3.5 w-3.5 ${currentStatusConfig.text}`} />
            {issue.status}
          </Badge>
        </div>
        <CardDescription className="text-xs text-muted-foreground">
          Reported on: {new Date(issue.dateReported).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 flex-grow">
        <p className="text-sm text-foreground/90 line-clamp-3">{issue.description}</p>
        <div className="flex items-center text-xs text-muted-foreground">
          <MapPin className="mr-1.5 h-4 w-4 flex-shrink-0" />
          <span className="truncate">{issue.location}</span>
        </div>
        <div className="flex items-center text-xs text-muted-foreground">
          <Tag className="mr-1.5 h-4 w-4 flex-shrink-0" />
          <span className="truncate">Category: {issue.category}</span>
        </div>
        {issue.aiClassification && (
          <div className="text-xs text-muted-foreground italic">
             AI Suggestion: {issue.aiClassification.category} ({(issue.aiClassification.confidence * 100).toFixed(0)}% confident)
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2 border-t pt-4 mt-auto">
        <Button asChild variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
          <Link href={`/citizen/my-reports/${issue.id}`}>
            <MessageSquare className="mr-1.5 h-4 w-4" /> View Details / Comments
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
