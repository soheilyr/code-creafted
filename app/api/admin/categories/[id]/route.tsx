import { NextResponse } from "next/server";

import { responseGenerator } from "@/server/helper/responseGenerator";
import { prisma } from "@/lib/prisma";

export const GET = async (
  _req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id: params.id },
    });

    if (!category) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(responseGenerator({ category }));
  } catch (err) {
    return NextResponse.json(
      { error: "Error fetching category" },
      { status: 500 }
    );
  }
};

export const PATCH = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const body = await req.json();
    const { name } = body;

    const category = await prisma.category.update({
      where: { id: params.id },
      data: { name },
    });

    return NextResponse.json(responseGenerator({ category }));
  } catch (err) {
    return NextResponse.json(
      { error: "Error updating category" },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  _req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    await prisma.category.delete({ where: { id: params.id } });
    return NextResponse.json(
      responseGenerator({ message: "Deleted successfully" })
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Error deleting category" },
      { status: 500 }
    );
  }
};
