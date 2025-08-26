import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string; // Replace with env in production

interface TokenPayload {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// Call this from API route or server component
export async function getUserFromToken(token: string): Promise<null | {
  name: string | null;
  id: string;
  email: string;
  isAdmin: boolean;
  isBlocked: boolean;
  avatar: string | null;
  following: {
    id: string;
    followerId: string;
    followingId: string;
  }[];
  followers: {
    id: string;
    followerId: string;
    followingId: string;
  }[];
}> {
  const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      isBlocked: true,
      isAdmin: true,
      followers: true,
      following: true,
    },
  });

  return user;
}
