import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key"; // Replace with env in production

interface TokenPayload {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// Call this from API route or server component
export async function getUserFromToken(token: string): Promise<null | {
  id: string;
  email: string;
  isBlocked: boolean;
  isAdmin: boolean;
}> {
  try {
    console.log(JWT_SECRET);
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
  } catch (error) {
    console.error("getUserFromToken error:", error);
    return null;
  }
}
