import { NextResponse } from "next/server";
import { responseGenerator } from "@/server/helper/responseGenerator";
import { prisma } from "@/lib/prisma";

export const DELETE = async (
  _req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    await prisma.blog.delete({ where: { id: params.id } });
    return NextResponse.json(
      responseGenerator({ message: "Blog deleted successfully" })
    );
  } catch (err) {
    console.error("Error deleting blog:", err);
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 }
    );
  }
};
