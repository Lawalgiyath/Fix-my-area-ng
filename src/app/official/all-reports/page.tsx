
// "use client"; // Not strictly needed if not using client-side hooks for filtering yet
import { MOCK_ISSUES } from "@/lib/constants"; // Will be an empty array
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
import { MoreHorizontal, Eye, Edit3, CheckCircle, AlertCircle, Clock, Frown } from "lucide-react"; // Added Frown
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link"; // Added for View Details button

const statusConfig: Record<Issue["status"], { icon: React.ElementType; badgeClass: string }> = {
  Submitted: { icon: AlertCircle, badgeClass: "bg-blue-100 text-blue-700 border-blue-300" },
  "In Progress": { icon: Clock, badgeClass: "bg-yellow-100 text-yellow-700 border-yellow-300" },
  Resolved: { icon: CheckCircle, badgeClass: "bg-green-100 text-green-700 border-green-300" },
  Rejected: { icon: AlertCircle, badgeClass: "bg-red-100 text-red-700 border-red-300" },
};

export default function AllReportsPage() {
  // In a real app, this data would come from an API with pagination, filtering, sorting
  const issues = MOCK_ISSUES;

  // TODO: Implement actual filtering and search logic when backend is connected
  // For now, these are UI placeholders.

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-primary">All Reported Issues</CardTitle>
        <CardDescription>Manage and track all issues submitted by citizens.</CardDescription>
        <div className="mt-4 flex flex-col md:flex-row gap-4">
          <Input placeholder="Search by title or ID..." className="max-w-sm" />
          <Select>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {/* Populate with actual categories from FORUM_CATEGORIES or a dedicated source */}
              {FORUM_CATEGORIES.map(cat => (
                 <SelectItem key={cat.slug} value={cat.slug}>{cat.name}</SelectItem>
              ))}
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Select>
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
        {issues.length === 0 ? (
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
                  <TableHead>Reporter</TableHead>
                  <TableHead>Date Reported</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {issues.map((issue) => {
                  const StatusIcon = statusConfig[issue.status].icon;
                  const badgeClass = statusConfig[issue.status].badgeClass;
                  return (
                    <TableRow key={issue.id}>
                      <TableCell className="font-medium">{issue.id}</TableCell>
                      <TableCell className="max-w-xs truncate">{issue.title}</TableCell>
                      <TableCell>{issue.category}</TableCell>
                      <TableCell>{issue.reporter || "N/A"}</TableCell>
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
                              {/* Link to a future official issue detail page */}
                              <Link href={`#`}> {/* Replace # with /official/all-reports/${issue.id} when page exists */}
                                <Eye className="mr-2 h-4 w-4" /> View Details 
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => alert('Update Status: Feature not implemented yet.')}>
                              <Edit3 className="mr-2 h-4 w-4" /> Update Status
                            </DropdownMenuItem>
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
      {issues.length > 0 && (
        <div className="flex items-center justify-end space-x-2 py-4 px-6 border-t">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled>Next</Button> 
            {/* Pagination disabled as there's no data or backend */}
        </div>
      )}
    </Card>
  );
}
// Added import for FORUM_CATEGORIES for filter dropdown
import { FORUM_CATEGORIES } from "@/lib/constants";
