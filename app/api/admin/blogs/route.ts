import { NextResponse } from "next/server";
import { responseGenerator } from "@/server/helper/responseGenerator";
import { prisma } from "@/lib/prisma";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const search = searchParams.get("search") || "";

    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { author: { name: { contains: search, mode: "insensitive" } } },
          ],
        }
      : {};

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        include: { author: true, category: true },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.blog.count({ where }),
    ]);

    return NextResponse.json(
      responseGenerator({ blogs, total, page, pageSize })
    );
  } catch (err) {
    console.error("Error fetching blogs:", err);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
};
