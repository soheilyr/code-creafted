import { NextResponse } from "next/server";
import { responseGenerator } from "@/server/helper/responseGenerator";
import { prisma } from "@/lib/prisma";

export const PATCH = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const body = await req.json();
    const { block } = body; // boolean

    if (typeof block !== "boolean") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: params.id },
      data: { isBlocked: block },
    });

    return NextResponse.json(
      responseGenerator({
        message: `User ${block ? "blocked" : "unblocked"} successfully`,
        user,
      })
    );
  } catch (error) {
    console.error("Block user error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};
