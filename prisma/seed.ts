import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = "admin@example.com"
  const adminPassword = "@Aa123456"
  const adminName = "admin"

  // هش کردن پسورد (هیچوقت رمز رو plaintext ذخیره نکن!)
  const hashedPassword = await bcrypt.hash(adminPassword, 10)

  // چک کن اگه ادمین وجود نداره، بسازش
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: adminName,
      password: hashedPassword,
      isAdmin: true,
    },
  })

  console.log("✅ Default admin created:", admin.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
