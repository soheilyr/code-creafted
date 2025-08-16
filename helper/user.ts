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

export const followUser = async (
  followerId: string,
  followingId: string
): Promise<void> => {
  if (followerId === followingId) {
    throw new Error("Cannot follow yourself");
  }

  const user = await prisma.user.findUnique({ where: { id: followingId } });
  if (!user) {
    throw new Error("User to follow not found");
  }
  if (user.isBlocked) {
    throw new Error("Cannot follow a blocked user");
  }

  // Check if already following
  const existingFollow = await prisma.user.findFirst({
    where: {
      id: followerId,
      following: { some: { id: followingId } },
    },
  });
  if (existingFollow) {
    throw new Error("Already following this user");
  }

  await prisma.user.update({
    where: { id: followerId },
    data: {
      following: { connect: { id: followingId } },
    },
  });
};

export const unfollowUser = async (
  followerId: string,
  followingId: string
): Promise<void> => {
  if (followerId === followingId) {
    throw new Error("Cannot unfollow yourself");
  }

  const user = await prisma.user.findUnique({ where: { id: followingId } });
  if (!user) {
    throw new Error("User to unfollow not found");
  }

  // Check if following exists
  const existingFollow = await prisma.user.findFirst({
    where: {
      id: followerId,
      following: { some: { id: followingId } },
    },
  });
  if (!existingFollow) {
    throw new Error("Not following this user");
  }

  await prisma.user.update({
    where: { id: followerId },
    data: {
      following: { disconnect: { id: followingId } },
    },
  });
};
