import { NextRequest, NextResponse } from "next/server";
import { responseGenerator } from "@/server/helper/responseGenerator";
import { getUserFromToken } from "@/server/auth/getUserFromToken";
import { followUser } from "@/helper/user";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = req.headers.get("token");
  if (!token) {
    return NextResponse.json(responseGenerator({}, "Unauthorized", 401, true));
  }

  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        responseGenerator({}, "Invalid or missing user ID", 400, true)
      );
    }

    const user = await getUserFromToken(token);
    if (!user || user.isBlocked) {
      return NextResponse.json(
        responseGenerator({}, "Unauthorized", 401, true)
      );
    }

    await followUser(user.id, id);
    return NextResponse.json(
      responseGenerator({}, "Successfully followed user", 200)
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      responseGenerator({}, "Failed to follow user", 400, true)
    );
  }
}
