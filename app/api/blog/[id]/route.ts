import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "@/lib/utils";
import { responseGenerator } from "@/server/helper/responseGenerator";
import { z } from "zod";
import { getUserFromToken } from "@/server/auth/getUserFromToken";

const updateBlogSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .optional(),
  content: z.string().optional(),
  imageUrl: z.string().url("Invalid URL").optional(),
  published: z.boolean().optional(),
  category: z.string().optional(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        responseGenerator({}, "Invalid or missing ID", 400, true)
      );
    }

    const blog = await prisma.blog.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        category: { select: { id: true, name: true } },
        savedBy: { select: { id: true, name: true } },
      },
    });

    if (!blog) {
      return NextResponse.json(
        responseGenerator({}, "Blog not found", 404, true)
      );
    }

    return NextResponse.json(
      responseGenerator(blog, "Blog fetched successfully", 200)
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      responseGenerator({}, "Failed to fetch blog", 500, true)
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = getToken();
  if (!token) {
    return NextResponse.json(responseGenerator({}, "Unauthorized", 401, true));
  }

  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        responseGenerator({}, "Invalid or missing ID", 400, true)
      );
    }

    const user = await getUserFromToken(token);
    if (!user || user.isBlocked) {
      return NextResponse.json(
        responseGenerator({}, "Unauthorized", 401, true)
      );
    }

    const blog = await prisma.blog.findUnique({ where: { id } });
    if (!blog) {
      return NextResponse.json(
        responseGenerator({}, "Blog not found", 404, true)
      );
    }
    if (blog.authorId !== user.id) {
      return NextResponse.json(
        responseGenerator({}, "Forbidden: You are not the author", 403, true)
      );
    }

    const body = await req.json();
    const validatedData = updateBlogSchema.parse(body);

    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        content: validatedData.content,
        imageUrl: validatedData.imageUrl,
        published: validatedData.published,
        ...(validatedData.category && {
          category: {
            connectOrCreate: {
              where: { name: validatedData.category },
              create: { name: validatedData.category },
            },
          },
        }),
        ...(validatedData.category === null && {
          category: { disconnect: true },
        }),
      },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        category: { select: { id: true, name: true } },
        savedBy: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(
      responseGenerator(updatedBlog, "Blog updated successfully", 200)
    );
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(responseGenerator({}, error.message, 400, true));
    }
    return NextResponse.json(
      responseGenerator({}, "Failed to update blog", 500, true)
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = getToken();
  if (!token) {
    return NextResponse.json(responseGenerator({}, "Unauthorized", 401, true));
  }

  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        responseGenerator({}, "Invalid or missing ID", 400, true)
      );
    }

    const user = await getUserFromToken(token);
    if (!user || user.isBlocked) {
      return NextResponse.json(
        responseGenerator({}, "Unauthorized", 401, true)
      );
    }

    const blog = await prisma.blog.findUnique({ where: { id } });
    if (!blog) {
      return NextResponse.json(
        responseGenerator({}, "Blog not found", 404, true)
      );
    }
    if (blog.authorId !== user.id) {
      return NextResponse.json(
        responseGenerator({}, "Forbidden: You are not the author", 403, true)
      );
    }

    await prisma.blog.delete({ where: { id } });
    return NextResponse.json(
      responseGenerator({}, "Blog deleted successfully", 200)
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      responseGenerator({}, "Failed to delete blog", 500, true)
    );
  }
}
