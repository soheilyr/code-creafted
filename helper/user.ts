import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Profile Schema (from user dashboard)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const profileSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters"),
  avatar: z.string().url("Invalid URL").optional(),
});

// Blog Schema (from user dashboard)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const blogSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
});

export const getUserProfile = async (
  userId: string
): Promise<Partial<User>> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, avatar: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const updateProfile = async (
  userId: string,
  data: z.infer<typeof profileSchema>
) => {
  return prisma.user.update({
    where: { id: userId },
    data,
    select: { id: true, name: true, email: true, avatar: true },
  });
};

export const createBlog = async (
  data: z.infer<typeof blogSchema>,
  userId: string
) => {
  return prisma.blog.create({
    data: {
      title: data.title,
      description: data.content.substring(0, 100), // Simplified for demo
      content: data.content,
      authorId: userId,
    },
  });
};

export const getFollowers = async (userId: string): Promise<FollowUser[]> => {
  return prisma.user.findMany({
    where: { following: { some: { id: userId } } },
    select: { id: true, name: true, avatar: true },
  });
};

export const getFollowing = async (userId: string): Promise<FollowUser[]> => {
  return prisma.user.findMany({
    where: { followers: { some: { id: userId } } },
    select: { id: true, name: true, avatar: true },
  });
};

export async function followUser(followerId: string, followingId: string) {
  if (followerId === followingId) {
    throw new Error("❌ نمی‌تونی خودتو فالو کنی!");
  }

  try {
    const follow = await prisma.follow.create({
      data: {
        followerId,
        followingId,
      },
    });
    return follow;
  } catch (error) {
    // duplicate constraint
    if (error.code === "P2002") {
      throw new Error("⚠️ قبلا این کاربر رو فالو کردی.");
    }
    throw error;
  }
}
export async function unfollowUser(followerId: string, followingId: string) {
  console.log("followUser", followerId, "following id", followingId);
  try {
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });
    return { success: true };
  } catch (error: any) {
    if (error.code === "P2025") {
      throw new Error("⚠️ رابطه‌ای برای آنفالو پیدا نشد.");
    }
    throw error;
  }
}
