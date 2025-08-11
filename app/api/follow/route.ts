// app/api/follow/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/server/auth/getUserFromToken";

export async function POST(req: NextRequest) {
  const token = req.headers.get("token");
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await getUserFromToken(token);
  if (!user || user.isBlocked) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { followingId } = await req.json();

  if (!followingId || followingId === user.id) {
    return NextResponse.json({ message: "Invalid follow request" }, { status: 400 });
  }

  try {
    // Create a follow record (won't duplicate due to @@unique)
    await prisma.follow.create({
      data: {
        followerId: user.id,
        followingId,
      },
    });

    return NextResponse.json({ message: "Followed successfully" }, { status: 201 });
  } catch (error) {
    if (
      error.code === "P2002" // Prisma duplicate key error
    ) {
      return NextResponse.json({ message: "Already following" }, { status: 400 });
    }

    console.error(error);
    return NextResponse.json({ message: "Failed to follow" }, { status: 500 });
  }
}
