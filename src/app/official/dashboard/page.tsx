import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Clock, ListChecks, Users, BarChart3 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OfficialDashboardPage() {
  const summaryData = [
    { title: "Total Reports Received", value: 125, icon: ListChecks, trend: "+15 this week", color: "text-blue-500" },
    { title: "Pending Action", value: 32, icon: Clock, trend: "High priority", color: "text-yellow-500" },
    { title: "Resolved This Month", value: 48, icon: CheckCircle, trend: "+5 from last month", color: "text-green-500" },
    { title: "High Alert Issues", value: 5, icon: AlertTriangle, trend: "Requires immediate attention", color: "text-red-500" },
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">Official Admin Panel</CardTitle>
          <CardDescription>Overview of civic issues and platform activity. Manage reports and monitor community feedback.</CardDescription>
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
          <Card key={item.title} className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <item.icon className={`h-5 w-5 ${item.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{item.value}</div>
              <p className="text-xs text-muted-foreground">{item.trend}</p>
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
            <ul className="space-y-3">
              <li className="flex items-start justify-between p-3 rounded-md bg-red-50 border border-red-200">
                <div>
                  <p className="font-semibold text-red-700">Major water pipe burst on Independence Way</p>
                  <p className="text-xs text-red-600">Reported: 2 hours ago - Category: Water Supply</p>
                </div>
                <Button variant="outline" size="sm" className="border-red-500 text-red-500 hover:bg-red-100">View</Button>
              </li>
              <li className="flex items-start justify-between p-3 rounded-md bg-yellow-50 border border-yellow-200">
                 <div>
                  <p className="font-semibold text-yellow-700">Bridge collapse warning on Express Road</p>
                  <p className="text-xs text-yellow-600">Reported: 1 day ago - Category: Roads & Transport</p>
                </div>
                <Button variant="outline" size="sm" className="border-yellow-500 text-yellow-500 hover:bg-yellow-100">View</Button>
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
             <CardDescription>At-a-glance platform metrics.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Average Resolution Time:</span><span className="font-semibold">3.5 days</span></div>
            <div className="flex justify-between"><span>Citizen Engagement Score:</span><span className="font-semibold text-green-600">78%</span></div>
            <div className="flex justify-between"><span>Most Reported Category:</span><span className="font-semibold">Roads & Transport</span></div>
            <div className="flex justify-between"><span>Active Officials Online:</span><span className="font-semibold">5</span></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
