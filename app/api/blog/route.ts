import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "@/lib/utils";
import { responseGenerator } from "@/server/helper/responseGenerator";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { getUserFromToken } from "@/server/auth/getUserFromToken";

const createBlogSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  content: z.string().optional(),
  imageUrl: z.string().url("Invalid URL").optional(),
  published: z.boolean().optional().default(false),
  category: z.string().optional(),
});

const getBlogsSchema = z.object({
  category: z.string().optional(),
  author: z.string().optional(),
  search: z.string().optional(),
  pageSize: z
    .string()
    .refine((val) => +val > 0, "Page size must be positive")
    .optional()
    .default("10"),
  pageNumber: z
    .string()
    .refine((val) => +val > 0, "Page number must be positive")
    .optional()
    .default("1"),
});

export async function POST(req: NextRequest) {
  const token = req.headers.get("token");
  if (!token) {
    return NextResponse.json(responseGenerator({}, "Unauthorized", 401, true));
  }

  try {
    const user = await getUserFromToken(token);
    if (!user || user.isBlocked) {
      return NextResponse.json(
        responseGenerator({}, "Unauthorized", 401, true)
      );
    }

    const body = await req.json();
    const validatedData = createBlogSchema.parse(body);

    const blog = await prisma.blog.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        content: validatedData.content,
        imageUrl: validatedData.imageUrl,
        published: validatedData.published,
        author: { connect: { id: user.id } },
        ...(validatedData.category && {
          category: {
            connectOrCreate: {
              where: { name: validatedData.category },
              create: { name: validatedData.category },
            },
          },
        }),
      },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        category: { select: { id: true, name: true } },
        savedBy: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(
      responseGenerator(blog, "Blog created successfully", 201)
    );
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(responseGenerator({}, error.message, 400, true));
    }
    return NextResponse.json(
      responseGenerator({}, "Failed to create blog", 500, true)
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const validatedParams = getBlogsSchema.parse({
      category: searchParams.get("category") ?? "",
      author: searchParams.get("author") ?? "",
      search: searchParams.get("search") ?? "",
      pageSize: searchParams.get("pageSize") ?? "1",
      pageNumber: searchParams.get("pageNumber") ?? "10",
      published: searchParams.get("published") ?? "",
    });

    const filters: Prisma.BlogWhereInput = {};

    if (validatedParams.category) {
      filters.category = {
        name: { equals: validatedParams.category, mode: "insensitive" },
      };
    }

    if (validatedParams.author) {
      filters.authorId = validatedParams.author;
    }

    if (validatedParams.search) {
      filters.title = { contains: validatedParams.search, mode: "insensitive" };
    }

    const blogs = await prisma.blog.findMany({
      where: filters,
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        category: { select: { id: true, name: true } },
        savedBy: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (+validatedParams.pageNumber - 1) * +validatedParams.pageSize,
      take: +validatedParams.pageSize,
    });

    const totalBlogs = await prisma.blog.count({ where: filters });

    return NextResponse.json(
      responseGenerator(
        {
          blogs,
          pagination: {
            total: totalBlogs,
            pageSize: validatedParams.pageSize,
            pageNumber: validatedParams.pageNumber,
            totalPages: Math.ceil(totalBlogs / +validatedParams.pageSize),
          },
        },
        "Fetched blogs successfully",
        200
      )
    );
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(responseGenerator({}, error.message, 400, true));
    }
    return NextResponse.json(
      responseGenerator({}, "Failed to fetch blogs", 500, true)
    );
  }
}
