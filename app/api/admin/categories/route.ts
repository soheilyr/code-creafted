import { NextResponse } from "next/server";
import { responseGenerator } from "@/server/helper/responseGenerator";
import { prisma } from "@/lib/prisma";

// GET (with search + pagination)
export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const search = searchParams.get("search") || "";

    const where = search
      ? { name: { contains: search, mode: "insensitive" } }
      : {};

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { name: "asc" },
      }),
      prisma.category.count({ where }),
    ]);

    return NextResponse.json(
      responseGenerator({ categories, total, page, pageSize })
    );
  } catch (err) {
    console.error("Error fetching categories:", err);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
};

// POST (create)
export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: { name },
    });

    return NextResponse.json(responseGenerator({ category }));
  } catch (err) {
    console.error("Error creating category:", err);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
};
