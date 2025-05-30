"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, PieChart, Bar, Line, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, AlertOctagon, Users, Clock } from "lucide-react";

const mockReportData = [
  { name: 'Jan', reports: 40, resolved: 24 },
  { name: 'Feb', reports: 30, resolved: 13 },
  { name: 'Mar', reports: 50, resolved: 43 },
  { name: 'Apr', reports: 47, resolved: 30 },
  { name: 'May', reports: 60, resolved: 38 },
  { name: 'Jun', reports: 58, resolved: 45 },
];

const mockCategoryData = [
  { name: 'Roads & Transport', value: 400 },
  { name: 'Waste Management', value: 300 },
  { name: 'Electricity', value: 250 },
  { name: 'Water Supply', value: 200 },
  { name: 'Security', value: 150 },
  { name: 'Other', value: 100 },
];
const COLORS = ['#008753', '#A3E47B', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];


const mockResolutionTimeData = [
  { date: '2024-07-01', time: 3.5 },
  { date: '2024-07-08', time: 4.1 },
  { date: '2024-07-15', time: 3.2 },
  { date: '2024-07-22', time: 3.8 },
  { date: '2024-07-29', time: 3.1 },
];


export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <CardHeader className="px-0">
        <CardTitle className="text-3xl font-bold text-primary">Platform Analytics</CardTitle>
        <CardDescription>Insights into issue reporting trends, resolution efficiency, and citizen engagement.</CardDescription>
      </CardHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,432</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Resolution Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.4 Days</div>
            <p className="text-xs text-muted-foreground">-0.2 days from last month</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Citizens</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">876</div>
            <p className="text-xs text-muted-foreground">+50 since last week</p>
          </CardContent>
        </Card>
         <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
            <AlertOctagon className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Currently pending</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Monthly Reports vs Resolved</CardTitle>
            <CardDescription>Tracking submitted and resolved issues over time.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockReportData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="reports" fill="hsl(var(--primary))" name="Total Reports" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" fill="hsl(var(--accent))" name="Resolved" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Report Categories Distribution</CardTitle>
            <CardDescription>Breakdown of issues by category.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {mockCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
       <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Average Resolution Time Trend</CardTitle>
            <CardDescription>Weekly average time taken to resolve reported issues.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockResolutionTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="time" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 8 }} name="Avg. Resolution Time (Days)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
    </div>
  );
}
