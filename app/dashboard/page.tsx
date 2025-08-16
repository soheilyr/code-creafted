"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserInfo } from "@/store/userInfoStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Cookies from "js-cookie";

interface BlogData {
  date: string;
  count: number;
}

export default function DashboardPage() {
  const { userInfo } = useUserInfo();
  const router = useRouter();
  const [metrics, setMetrics] = useState<{
    totalUsers: number;
    totalBlogs: number;
    lastMonthBlogs: number;
    blogChartData: BlogData[];
  }>({
    totalUsers: 0,
    totalBlogs: 0,
    lastMonthBlogs: 0,
    blogChartData: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  async function fetchMetrics() {
    const token = Cookies.get("token");
    try {
      setIsLoading(true);

      // Fetch total users
      const res = await fetch("/api/metrics", {
        headers: {
          token: token?.toString(),
        },
      });

      const metrics = await res.json();

      console.log(metrics.data);
      setMetrics({
        blogChartData: metrics.data.blogC,
        lastMonthBlogs: 0,
        totalBlogs: 0,
        totalUsers: 0,
      });
    } catch (error) {
      console.error("Error fetching metrics:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Redirect non-authenticated users

  // Fetch metrics and chart data
  useEffect(() => {
    fetchMetrics();
  }, []);

  if (isLoading || !userInfo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Sidebar */}

      {/* Main Content */}
      <section className="flex-1 p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-semibold text-primary mb-6">
            Welcome, {userInfo?.name || userInfo?.email || "User"}!
          </h1>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-foreground">
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">
                  {metrics.totalUsers}
                </p>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-foreground">
                  Total Blogs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">
                  {metrics.totalBlogs}
                </p>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-foreground">
                  Last Month&apos;s Blogs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">
                  {metrics.lastMonthBlogs}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Chart */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-foreground">
                Blog Posts (Last Month)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metrics.blogChartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border)"
                    />
                    <XAxis dataKey="date" stroke="var(--foreground)" />
                    <YAxis stroke="var(--foreground)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                        borderColor: "var(--border)",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="var(--chart-1)"
                      strokeWidth={2}
                      name="Blog Posts"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </>
  );
}
