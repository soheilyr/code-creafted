import { NextRequest, NextResponse } from "next/server";
import { responseGenerator } from "@/server/helper/responseGenerator";
import { getUserFromToken } from "@/server/auth/getUserFromToken";
import { getFollowers } from "@/helper/user";

export async function GET(req: NextRequest) {
  const token = req.headers.get("token");
  if (!token) {
    return NextResponse.json(responseGenerator({}, "Unauthorized", 401, true));
  }

  try {
    const user = await getUserFromToken(token);
    if (!user || user.isBlocked) {
      return NextResponse.json(
        responseGenerator({}, "Unauthorized", 401, true)
      );
    }

    const followers = await getFollowers(user.id);
    return NextResponse.json(
      responseGenerator({ followers }, "Fetched followers successfully", 200)
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      responseGenerator({}, "Failed to fetch followers", 500, true)
    );
  }
}
