"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserInfo } from "@/store/userInfoStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { toast } from "sonner";

interface UserData {
  id: string;
  name: string | null;
  email: string;
}

export default function FollowersPage() {
  const { userInfo } = useUserInfo();
  const router = useRouter();
  const [followers, setFollowers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect non-authenticated users
  useEffect(() => {
    if (!userInfo) {
      router.push("/auth/login");
    }
    if (userInfo?.isAdmin) {
      router.push("/dashboard");
    }
  }, [userInfo, router]);

  // Fetch followers
  useEffect(() => {
    async function fetchFollowers() {
      try {
        setIsLoading(true);
        const followersData = await prisma.follow.findMany({
          where: { followingId: userInfo?.id },
          select: {
            follower: { select: { id: true, name: true, email: true } },
          },
        });
        setFollowers(followersData.map((f) => f.follower));
      } catch (error) {
        console.error("Error fetching followers:", error);
        toast("Error", {
          description: "Failed to load followers.",
        });
      } finally {
        setIsLoading(false);
      }
    }

    if (userInfo && !userInfo.isAdmin) {
      fetchFollowers();
    }
  }, [userInfo]);

  if (isLoading || !userInfo || userInfo.isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar (Copy from DashboardPage, omitted for brevity) */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-primary">
              My Followers
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
      </main>
    </div>
  );
}
