
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FilePlus2, ListChecks, MessagesSquare, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import Link from "next/link";

export default function CitizenDashboardPage() {
  const summaryStats = [
    { title: "Total Reports", value: 5, icon: ListChecks, color: "text-primary" },
    { title: "Pending Review", value: 2, icon: Clock, color: "text-yellow-500" },
    { title: "Resolved Issues", value: 3, icon: CheckCircle, color: "text-green-500" },
  ];

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
                {stat.title === "Total Reports" ? "+2 this month" : 
                 stat.title === "Pending Review" ? "Awaiting action" : "Successfully addressed"}
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
          <ul className="space-y-3">
            <li className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <p className="truncate">Your report "<span className="font-semibold">Broken Streetlight on Elm St</span>" was marked as <span className="font-semibold text-green-600">Resolved</span>.</p>
              <span className="ml-auto text-xs text-muted-foreground whitespace-nowrap">2 days ago</span>
            </li>
            <li className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
              <p className="truncate">New forum post in "Roads & Transport": <span className="font-semibold text-primary">Traffic Light Timings</span>.</p>
              <span className="ml-auto text-xs text-muted-foreground whitespace-nowrap">5 hours ago</span>
            </li>
             <li className="flex items-center space-x-3">
              <FilePlus2 className="h-5 w-5 text-primary flex-shrink-0" />
              <p className="truncate">You submitted a new report: <span className="font-semibold text-primary">"Overflowing Dustbin at Park Entrance"</span>.</p>
              <span className="ml-auto text-xs text-muted-foreground whitespace-nowrap">1 day ago</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
