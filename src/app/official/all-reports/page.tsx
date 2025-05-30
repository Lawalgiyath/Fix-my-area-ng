import { MOCK_ISSUES } from "@/lib/constants";
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
import { MoreHorizontal, Eye, Edit3, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const statusConfig: Record<Issue["status"], { icon: React.ElementType; badgeClass: string }> = {
  Submitted: { icon: AlertCircle, badgeClass: "bg-blue-100 text-blue-700 border-blue-300" },
  "In Progress": { icon: Clock, badgeClass: "bg-yellow-100 text-yellow-700 border-yellow-300" },
  Resolved: { icon: CheckCircle, badgeClass: "bg-green-100 text-green-700 border-green-300" },
  Rejected: { icon: AlertCircle, badgeClass: "bg-red-100 text-red-700 border-red-300" },
};

export default function AllReportsPage() {
  // In a real app, this data would come from an API with pagination, filtering, sorting
  const issues = MOCK_ISSUES;

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-primary">All Reported Issues</CardTitle>
        <CardDescription>Manage and track all issues submitted by citizens.</CardDescription>
        <div className="mt-4 flex flex-col md:flex-row gap-4">
          <Input placeholder="Search by title or reporter..." className="max-w-sm" />
          <Select>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {/* Populate with actual categories */}
              <SelectItem value="roads">Roads & Transport</SelectItem>
              <SelectItem value="waste">Waste Management</SelectItem>
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
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
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
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
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
        {issues.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">No issues found.</div>
        )}
      </CardContent>
      {/* Pagination placeholder */}
      <div className="flex items-center justify-end space-x-2 py-4 px-6 border-t">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm">Next</Button>
      </div>
    </Card>
  );
}
