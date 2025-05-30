
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Clock, ListChecks, Users, BarChart3, Info } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OfficialDashboardPage() {
  // These values would typically be fetched from a backend
  const summaryData = [
    { title: "Total Reports Received", value: "0", icon: ListChecks, trend: "No new reports this week", color: "text-blue-500" },
    { title: "Pending Action", value: "0", icon: Clock, trend: "No issues currently pending urgent review.", color: "text-yellow-500" },
    { title: "Resolved This Month", value: "0", icon: CheckCircle, trend: "No issues resolved this month", color: "text-green-500" },
    { title: "High Alert Issues", value: "0", icon: AlertTriangle, trend: "No current high-alert issues.", color: "text-red-500" },
  ];

  // This would be populated from backend data
  const highPriorityReports: React.ReactNode[] = [];

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">Official Admin Panel</CardTitle>
          <CardDescription className="line-clamp-3">Overview of civic issues and platform activity. Manage reports, monitor community feedback, and gain insights through analytics to improve service delivery.</CardDescription>
        </CardHeader>
         <CardContent className="grid gap-4 md:grid-cols-2">
           <Link href="/official/all-reports" passHref>
            <Button size="lg" className="w-full py-6 text-md bg-primary hover:bg-primary/90">
              <ListChecks className="mr-2 h-6 w-6" /> View All Reports
            </Button>
          </Link>
          <Link href="/official/analytics" passHref>
            <Button variant="outline" size="lg" className="w-full py-6 text-md border-primary text-primary hover:bg-primary/5">
              <BarChart3 className="mr-2 h-6 w-6" /> View Analytics
            </Button>
          </Link>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {summaryData.map((item) => (
          <Card key={item.title} className="shadow-md hover:shadow-lg transition-shadow flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium truncate">{item.title}</CardTitle>
              <item.icon className={`h-5 w-5 ${item.color} flex-shrink-0`} />
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="text-3xl font-bold">{item.value}</div>
              <p className="text-xs text-muted-foreground line-clamp-2">{item.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Recent High Priority Reports</CardTitle>
            <CardDescription>Issues requiring immediate attention.</CardDescription>
          </CardHeader>
          <CardContent>
            {highPriorityReports.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                <Info className="h-10 w-10 mb-3" />
                <p>No high priority reports at the moment.</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {highPriorityReports.map((report, index) => (
                  <li key={index}>{report}</li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
             <CardDescription>At-a-glance platform metrics.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {/* These would be fetched from backend */}
            <div className="flex justify-between"><span>Average Resolution Time:</span><span className="font-semibold">N/A</span></div>
            <div className="flex justify-between"><span>Citizen Engagement Score:</span><span className="font-semibold text-muted-foreground">N/A</span></div>
            <div className="flex justify-between"><span>Most Reported Category:</span><span className="font-semibold">N/A</span></div>
            <div className="flex justify-between"><span>Active Officials Online:</span><span className="font-semibold">N/A</span></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
