import { prisma } from "@/lib/prisma";

// Call this from API route or server component
export async function getUserBlogs(id: string): Promise<BlogType[]> {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        writtenBlogs: true,
      },
    });

    return user?.writtenBlogs ?? [];
  } catch (error) {
    console.error("getUserFromToken error:", error);
    return [];
  }
}
