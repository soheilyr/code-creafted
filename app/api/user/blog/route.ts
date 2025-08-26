import { prisma } from "@/lib/prisma";
import { responseGenerator } from "@/server/helper/responseGenerator";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    NextResponse.json({ status: 404, message: "Id not found" });
  } else {
    try {
      const blogsData = await prisma.user.findUnique({
        where: { id },
        include: {
          writtenBlogs: {
            select: {
              id: true,
              title: true,
              description: true,
              imageUrl: true,
              createdAt: true,
              published: true,
            },
          },
        },
      });
      if (!blogsData) {
        NextResponse.json({
          status: 404,
          message: "no blog found for this user",
        });
      }
      return NextResponse.json(
        responseGenerator({
          blogs: blogsData,
        })
      );
    } catch (error) {
      console.log(error);
      NextResponse.json({ status: 401, message: "invalid token" });
    }
  }
}
