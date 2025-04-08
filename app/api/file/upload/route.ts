import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import { responseGenerator } from "@/server/helper/responseGenerator";

export const POST = async (req: Request) => {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Get original name (could be a full URL or weird characters)
  const originalName = file.name;

  // Remove full URL paths if present
  const extractedName = originalName.split("/").pop()?.split("?")[0] ?? "file";

  // Remove unsafe characters and replace spaces
  const safeName = extractedName
    .replace(/[^a-zA-Z0-9.\-_]/g, "_") // keep only safe characters
    .replace(/\s+/g, "_");

  // Optionally add a timestamp or random string to prevent overwrites
  const timestamp = Date.now();
  const finalFileName = `${timestamp}_${safeName}`;

  try {
    const uploadPath = path.join(
      process.cwd(),
      "public/uploads",
      finalFileName
    );
    await writeFile(uploadPath, buffer);

    return NextResponse.json(
      responseGenerator({ url: `/uploads/${finalFileName}` })
    );
  } catch (error) {
    console.log("Error occurred ", error);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
};
