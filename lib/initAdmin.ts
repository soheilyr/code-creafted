import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function ensureAdminUser() {
  const existingAdmin = await prisma.user.findUnique({
    where: { email: process.env.adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(
      process.env.adminPassword ?? "",
      10
    );

    await prisma.user.create({
      data: {
        email: process.env.adminEmail ?? "",
        name: process.env.adminName,
        password: hashedPassword,
        isAdmin: true,
      },
    });

    console.log("✅ Default admin created.");
  } else {
    console.log("ℹ️ Admin already exists.");
  }
}
