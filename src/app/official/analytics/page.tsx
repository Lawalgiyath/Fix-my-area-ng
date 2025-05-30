
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, PieChart, Bar, Line, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, AlertOctagon, Users, Clock, Info } from "lucide-react";

// Data would be fetched from backend. Empty arrays mean charts will be empty.
const reportData: { name: string, reports: number, resolved: number }[] = [];
const categoryData: { name: string, value: number }[] = [];
const resolutionTimeData: { date: string, time: number }[] = [];

// Colors for the Pie chart, can be kept as they are static styling options
const COLORS = ['#008753', '#A3E47B', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];


export default function AnalyticsPage() {
  const renderEmptyChartState = () => (
    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
      <Info className="h-12 w-12 mb-4" />
      <p className="text-lg">No data available for this chart.</p>
      <p className="text-sm">Data will appear here once reports are processed.</p>
    </div>
  );

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
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">No data yet</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Resolution Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">N/A</div>
            <p className="text-xs text-muted-foreground">No data yet</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Citizens</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">No data yet</p>
          </CardContent>
        </Card>
         <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
            <AlertOctagon className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">No data yet</p>
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
            {reportData.length === 0 ? renderEmptyChartState() : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reportData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="reports" fill="hsl(var(--primary))" name="Total Reports" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="resolved" fill="hsl(var(--accent))" name="Resolved" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Report Categories Distribution</CardTitle>
            <CardDescription>Breakdown of issues by category.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            {categoryData.length === 0 ? renderEmptyChartState() : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
       <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Average Resolution Time Trend</CardTitle>
            <CardDescription>Weekly average time taken to resolve reported issues.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            {resolutionTimeData.length === 0 ? renderEmptyChartState() : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={resolutionTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="time" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 8 }} name="Avg. Resolution Time (Days)" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
    </div>
  );
}
