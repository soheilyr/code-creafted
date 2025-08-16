import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/server/auth/getUserFromToken";
import { responseGenerator } from "@/server/helper/responseGenerator";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const token = req.headers.get("token");
  if (!token) {
    NextResponse.json({ status: 401, message: "Unauthorized" });
  } else {
    try {
      console.log(token);
      const user = await getUserFromToken(token);
      if (!user?.isAdmin) {
        NextResponse.json({ status: 403, message: "Forbidden" });
      }
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

      return NextResponse.json(
        responseGenerator({
          ...user,
          blogChartData: [...blogChartData],
          totalBlogs,
          totalUsers,
          lastMonthBlogs,
        })
      );
    } catch (error) {
      console.log(error);
      NextResponse.json({ status: 401, message: "invalid token" });
    }
  }
}
