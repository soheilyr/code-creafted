import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/server/auth/getUserFromToken";
import { responseGenerator } from "@/server/helper/responseGenerator";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const token = req.headers.get("token");
  if (!token) {
    NextResponse.json({ status: 401, message: "Unauthorized" });
  } else {
    try {
      const user = await getUserFromToken(token);
      if (!user?.isAdmin) {
        NextResponse.json({ status: 403, message: "Forbidden" });
      }
      const totalUsers = await prisma.user.findMany({
        where: {
          isAdmin: false,
        },
      });

      return NextResponse.json(
        responseGenerator({
          users: [...totalUsers],
        })
      );
    } catch (error) {
      console.log(error);
      NextResponse.json({ status: 401, message: "invalid token" });
    }
  }
}
