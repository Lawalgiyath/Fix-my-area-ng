
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FilePlus2, ListChecks, MessagesSquare, CheckCircle, AlertTriangle, Clock, Info } from "lucide-react";
import Link from "next/link";

export default function CitizenDashboardPage() {
  // Values should ideally be fetched from a backend.
  const summaryStats = [
    { title: "Total Reports", value: 0, icon: ListChecks, color: "text-primary" },
    { title: "Pending Review", value: 0, icon: Clock, color: "text-yellow-500" },
    { title: "Resolved Issues", value: 0, icon: CheckCircle, color: "text-green-500" },
  ];

  // This would be populated from backend data (e.g., notifications or recent user actions)
  const recentActivity: React.ReactNode[] = []; 

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Welcome, Citizen!</CardTitle>
          <CardDescription className="line-clamp-3">Your central hub for civic engagement. Report issues, track progress, and connect with your community.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <Link href="/citizen/report-issue" passHref>
            <Button size="lg" className="w-full py-8 text-lg bg-primary hover:bg-primary/90">
              <FilePlus2 className="mr-3 h-7 w-7" /> Report a New Issue
            </Button>
          </Link>
          <Link href="/citizen/my-reports" passHref>
            <Button variant="outline" size="lg" className="w-full py-8 text-lg border-primary text-primary hover:bg-primary/5">
              <ListChecks className="mr-3 h-7 w-7" /> View My Reports
            </Button>
          </Link>
          <Link href="/citizen/forum" passHref>
            <Button variant="outline" size="lg" className="w-full py-8 text-lg border-accent text-accent-foreground hover:bg-accent/10">
              <MessagesSquare className="mr-3 h-7 w-7" /> Join Forum Discussions
            </Button>
          </Link>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        {summaryStats.map(stat => (
          <Card key={stat.title} className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium truncate">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {/* Trend data would also come from backend */}
                {stat.title === "Total Reports" ? "No new reports this month" : 
                 stat.title === "Pending Review" ? "Awaiting action" : "No issues resolved recently"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
              <Info className="h-10 w-10 mb-3" />
              <p>No recent activity to display.</p>
              <p className="text-xs mt-1">Your interactions will appear here.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {recentActivity.map((activity, index) => (
                <li key={index} className="flex items-center space-x-3">
                  {activity}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
