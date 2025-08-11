import { prisma } from "@/lib/prisma"; // Update if your prisma import path is different
import { responseGenerator } from "@/server/helper/responseGenerator";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!params.id || typeof params.id !== "string") {
    return NextResponse.json(
      responseGenerator({}, "Invalid or missing ID", 400, true)
    );
  }

  try {
    // Fetch the blog by ID, including the author details (name, avatar)
    const blog = await prisma.blog.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            name: true,
            avatar: true,
            id: true,
          },
        },
      },
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" });
    }

    return NextResponse.json(blog); // Return the found blog
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch blog" });
  }
}
