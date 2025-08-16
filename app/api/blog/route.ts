import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/server/auth/getUserFromToken";
import { responseGenerator } from "@/server/helper/responseGenerator";
import { Prisma } from "@prisma/client";

export async function POST(req: NextRequest) {
  const token = req.headers.get("token");
  console.log(token);
  if (!token) {
    return NextResponse.json({ message: "unauthorized!", staus: 401 });
  }
  try {
    const user = await getUserFromToken(token); // assuming middleware or JWT

    if (!user || user.isBlocked) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      title,
      description,
      category,
      imageUrl = null,
      content = null,
    } = await req.json();

    await prisma.blog.create({
      data: {
        title,
        description,
        author: {
          connect: { id: user.id },
        },
        imageUrl,
        content,
        category: {
          connectOrCreate: {
            where: { name: category },
            create: { name: category },
          },
        },
      },
    });

    return NextResponse.json(responseGenerator({}, "Created!", 201));
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    );
  }
}
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const author = searchParams.get("author");
    const search = searchParams.get("search");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const pageNumber = parseInt(searchParams.get("pageNumber") || "1");

    const filters: Prisma.BlogWhereInput = {};

    if (category) {
      filters.category = {
        name: {
          equals: category,
          mode: "insensitive",
        },
      };
    }

    if (author) {
      filters.authorId = author;
    }

    if (search) {
      filters.title = {
        contains: search,
        mode: "insensitive",
      };
    }

    const blogs = await prisma.blog.findMany({
      where: filters,
      include: {
        author: {
          select: {
            name: true,
            avatar: true,
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });
    if (!!blogs.length) {
      const totalBlogs = await prisma.blog.count({
        where: filters,
      });
      return NextResponse.json(
        responseGenerator(
          {
            blogs,
            pagination: {
              total: totalBlogs,
              pageSize,
              pageNumber,
              totalPages: Math.ceil(totalBlogs / pageSize),
            },
          },
          "Fetched blogs!",
          200
        )
      );
    }
    return NextResponse.json(
      responseGenerator(
        {
          blogs: [],
          pagination: {
            total: 0,
            pageSize: 0,
            pageNumber: 1,
            totalPages: 0,
          },
        },
        "Fetched blogs!",
        200
      )
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}
