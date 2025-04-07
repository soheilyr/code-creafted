import { getUserFromToken } from "@/server/auth/getUserFromToken";
import { responseGenerator } from "@/server/helper/responseGenerator";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  console.log(req);
  const token = req.headers.get("token");
  if (!token) {
    NextResponse.json({ status: 401, message: "Unauthorized" });
  } else {
    const user = await getUserFromToken(token);
    return NextResponse.json(responseGenerator({ ...user }));
  }
}
