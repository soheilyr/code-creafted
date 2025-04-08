import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/server/auth/getUserFromToken";
import { responseGenerator } from "@/server/helper/responseGenerator";

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
export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
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

    return NextResponse.json(responseGenerator([...blogs], "Created!", 201));
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}
