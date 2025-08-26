"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserInfo } from "@/store/userInfoStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  Menu,
  Users,
  FileText,
  LayoutDashboard,
  Tag,
  Heart,
} from "lucide-react";
import Link from "next/link";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma"; // Adjust path to your Prisma client
import { toast } from "sonner";

interface BlogData {
  date: string;
  count: number;
}

interface UserData {
  id: string;
  name: string | null;
  email: string;
}

export default function DashboardPage() {
  const { userInfo } = useUserInfo();
  const router = useRouter();
  const [metrics, setMetrics] = useState<{
    totalBlogs: number;
    totalFollowers: number;
    totalFollowing: number;
    blogChartData: BlogData[];
  }>({
    totalBlogs: 0,
    totalFollowers: 0,
    totalFollowing: 0,
    blogChartData: [],
  });
  const [blogs, setBlogs] = useState<
    { id: string; title: string; description: string; published: boolean }[]
  >([]);
  const [followers, setFollowers] = useState<UserData[]>([]);
  const [following, setFollowing] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect non-authenticated users
  useEffect(() => {
    if (!userInfo) {
      router.push("/auth/login");
    }
  }, [userInfo, router]);

  // Fetch user data
  useEffect(() => {
    async function fetchUserData() {
      if (!userInfo || userInfo.isAdmin) return; // Skip for admins
      try {
        setIsLoading(true);

        // Fetch user's blogs
        const userBlogs = await prisma.blog.findMany({
          where: { authorId: userInfo.id, published: true },
          select: { id: true, title: true, description: true, published: true },
        });

        // Fetch total blogs
        const totalBlogs = userBlogs.length;

        // Fetch followers
        const followersData = await prisma.follow.findMany({
          where: { followingId: userInfo.id },
          select: {
            follower: { select: { id: true, name: true, email: true } },
          },
        });

        // Fetch following
        const followingData = await prisma.follow.findMany({
          where: { followerId: userInfo.id },
          select: {
            following: { select: { id: true, name: true, email: true } },
          },
        });

        // Fetch blog counts for the last month
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const blogData = await prisma.blog.groupBy({
          by: ["createdAt"],
          where: {
            authorId: userInfo.id,
            published: true,
            createdAt: { gte: oneMonthAgo },
          },
          _count: { id: true },
          orderBy: { createdAt: "asc" },
        });

        // Format chart data
        const blogChartData = blogData.map((entry) => ({
          date: new Date(entry.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          count: entry._count.id,
        }));

        setMetrics({
          totalBlogs,
          totalFollowers: followersData.length,
          totalFollowing: followingData.length,
          blogChartData,
        });
        setBlogs(userBlogs);
        setFollowers(followersData.map((f) => f.follower));
        setFollowing(followingData.map((f) => f.following));
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast("Error", {
          description: "Failed to load dashboard data.",
        });
      } finally {
        setIsLoading(false);
      }
    }

    async function fetchAdminData() {
      if (!userInfo || !userInfo.isAdmin) return;
      try {
        setIsLoading(true);

        // Fetch total users
        const totalUsers = await prisma.user.count();

        // Fetch total published blogs
        const totalBlogs = await prisma.blog.count({
          where: { published: true },
        });

        // Fetch blogs from last month
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const lastMonthBlogs = await prisma.blog.count({
          where: {
            published: true,
            createdAt: { gte: oneMonthAgo },
          },
        });

        // Fetch daily blog counts for the last month
        const blogData = await prisma.blog.groupBy({
          by: ["createdAt"],
          where: {
            published: true,
            createdAt: { gte: oneMonthAgo },
          },
          _count: { id: true },
          orderBy: { createdAt: "asc" },
        });

        // Format chart data
        const blogChartData = blogData.map((entry) => ({
          date: new Date(entry.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          count: entry._count.id,
        }));

        setMetrics({
          totalBlogs: totalUsers, // For admin, show total users as a metric
          totalFollowers: totalBlogs, // Repurpose as total blogs
          totalFollowing: lastMonthBlogs, // Repurpose as last month's blogs
          blogChartData,
        });
      } catch (error) {
        console.error("Error fetching admin data:", error);
        toast("Error", {
          description: "Failed to load admin dashboard data.",
        });
      } finally {
        setIsLoading(false);
      }
    }

    if (userInfo?.isAdmin) {
      fetchAdminData();
    } else {
      fetchUserData();
    }
  }, [userInfo]);

  if (isLoading || !userInfo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <>
    
      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-semibold text-primary mb-6">
            Welcome, {userInfo.name || userInfo.email || "User"}!
          </h1>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-foreground">
                  {userInfo.isAdmin ? "Total Users" : "My Blogs"}
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
                  {userInfo.isAdmin ? "Total Blogs" : "Followers"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">
                  {metrics.totalFollowers}
                </p>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-foreground">
                  {userInfo.isAdmin ? "Last Month's Blogs" : "Following"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">
                  {metrics.totalFollowing}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Chart */}
          <Card className="border-border mb-8">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-foreground">
                {userInfo.isAdmin
                  ? "Blog Posts (Last Month)"
                  : "My Blog Posts (Last Month)"}
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

          {/* User-Specific Sections */}
          {!userInfo.isAdmin && (
            <>
              {/* My Blogs */}
              <Card className="border-border mb-8">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-foreground">
                    My Blogs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {blogs.map((blog) => (
                        <TableRow key={blog.id}>
                          <TableCell>{blog.title}</TableCell>
                          <TableCell>{blog.description}</TableCell>
                          <TableCell>
                            {blog.published ? (
                              <span className="text-primary">Published</span>
                            ) : (
                              <span className="text-muted-foreground">
                                Draft
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/blogs/${blog.id}`}>View</Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Followers */}
              <Card className="border-border mb-8">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-foreground">
                    Followers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {followers.map((follower) => (
                        <TableRow key={follower.id}>
                          <TableCell>{follower.name || "N/A"}</TableCell>
                          <TableCell>{follower.email}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Following */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-foreground">
                    Following
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {following.map((followed) => (
                        <TableRow key={followed.id}>
                          <TableCell>{followed.name || "N/A"}</TableCell>
                          <TableCell>{followed.email}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}
        </motion.div>
      </main>
    </>
  );
}
