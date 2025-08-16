import { getUserFromToken } from "@/server/auth/getUserFromToken";
import { responseGenerator } from "@/server/helper/responseGenerator";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const token = req.headers.get("token");
  if (!token) {
    return NextResponse.json({ status: 401, message: "Unauthorized" });
  } else {
    try {
      console.log(token);
      const user = await getUserFromToken(token);
      return NextResponse.json(responseGenerator({ ...user }));
    } catch (error) {
      console.log(error);
      return NextResponse.json({ status: 401, message: "invalid token" });
    }
  }
}
