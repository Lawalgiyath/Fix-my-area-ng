
"use client"; // Convert to client component

import { useEffect, useState } from 'react';
import type { Issue } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit3, CheckCircle, AlertCircle, Clock, Frown, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { FORUM_CATEGORIES } from "@/lib/constants"; // For category filter
import { getAllReportedIssues, updateIssueStatus } from '@/actions/issue-actions'; // Use refactored actions
import { useToast } from '@/hooks/use-toast';

const statusConfig: Record<Issue["status"], { icon: React.ElementType; badgeClass: string }> = {
  Submitted: { icon: AlertCircle, badgeClass: "bg-blue-100 text-blue-700 border-blue-300" },
  "In Progress": { icon: Clock, badgeClass: "bg-yellow-100 text-yellow-700 border-yellow-300" },
  Resolved: { icon: CheckCircle, badgeClass: "bg-green-100 text-green-700 border-green-300" },
  Rejected: { icon: AlertCircle, badgeClass: "bg-red-100 text-red-700 border-red-300" },
};

export default function AllReportsPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");


  const fetchIssues = () => {
    setIsLoading(true);
    setError(null);
    getAllReportedIssues()
      .then(fetchedIssues => {
        setIssues(fetchedIssues);
      })
      .catch(err => {
        console.error("Error fetching all issues:", err);
        setError("Failed to load issues. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleUpdateStatus = async (issueId: string, newStatus: Issue["status"]) => {
    // In a real app, you'd likely open a dialog for notes, confirmation, etc.
    const result = await updateIssueStatus(issueId, newStatus, `Status updated to ${newStatus} by official.`);
    if (result.success) {
      toast({ title: "Status Updated", description: `Issue ${issueId.substring(0,6)} status changed to ${newStatus}.`, className: "bg-green-50 border-green-200 text-green-700"});
      fetchIssues(); // Re-fetch to show updated data
    } else {
      toast({ title: "Update Failed", description: result.error || "Could not update status.", variant: "destructive" });
    }
  };

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = searchTerm === "" || 
                          issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          issue.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || 
                            (issue.categoryManual || issue.aiClassification?.category || issue.category)?.toLowerCase() === categoryFilter.toLowerCase();
    const matchesStatus = statusFilter === "all" || issue.status.toLowerCase().replace(" ", "-") === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading all reports...</p>
      </div>
    );
  }

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-primary">All Reported Issues</CardTitle>
        <CardDescription>Manage and track all issues submitted by citizens. {process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' && "(Mock Data Mode)"}</CardDescription>
        <div className="mt-4 flex flex-col md:flex-row gap-4">
          <Input 
            placeholder="Search by title or ID..." 
            className="max-w-sm" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {FORUM_CATEGORIES.map(cat => ( // Assuming FORUM_CATEGORIES covers issue categories
                 <SelectItem key={cat.slug} value={cat.name.toLowerCase()}>{cat.name}</SelectItem>
              ))}
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {error ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : filteredIssues.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Frown className="mx-auto h-16 w-16 text-primary/50 mb-4" />
            <h3 className="text-xl font-semibold text-primary">No Issues Found</h3>
            <p>There are currently no issues reported or matching your filter criteria.</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Reporter ID</TableHead>
                  <TableHead>Date Reported</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIssues.map((issue) => {
                  const StatusIcon = statusConfig[issue.status]?.icon || Info;
                  const badgeClass = statusConfig[issue.status]?.badgeClass || "";
                  return (
                    <TableRow key={issue.id}>
                      <TableCell className="font-medium">{issue.id.substring(0, 6)}...</TableCell>
                      <TableCell className="max-w-xs truncate">{issue.title}</TableCell>
                      <TableCell>{issue.categoryManual || issue.aiClassification?.category || issue.category || 'N/A'}</TableCell>
                      <TableCell className="truncate">{issue.reportedById ? issue.reportedById.substring(0,10) + '...' : 'N/A'}</TableCell>
                      <TableCell>{new Date(issue.dateReported).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs ${badgeClass}`}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {issue.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                               <Link href={`/official/all-reports/${issue.id}`}>
                                <Eye className="mr-2 h-4 w-4" /> View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                            {(Object.keys(statusConfig) as Issue["status"][]).map(statusValue => (
                                <DropdownMenuItem 
                                    key={statusValue} 
                                    onClick={() => handleUpdateStatus(issue.id, statusValue)}
                                    disabled={issue.status === statusValue}
                                >
                                 {issue.status === statusValue ? <CheckCircle className="mr-2 h-4 w-4 text-green-500"/> : <Edit3 className="mr-2 h-4 w-4" />}
                                 Set to {statusValue}
                                </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      {filteredIssues.length > 0 && (
        <div className="flex items-center justify-end space-x-2 py-4 px-6 border-t">
            {/* Basic pagination example - would need more logic for real pagination */}
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled>Next</Button>
        </div>
      )}
    </Card>
  );
}
