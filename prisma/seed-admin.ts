import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding admin user...");

  // Hash password
  const hashedPassword = await bcrypt.hash("khangmyadmin@2025", 10);

  // Create or update admin user
  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {
      password: hashedPassword,
      name: "Administrator",
      email: "khangmyfruit.contact@gmail.com",
      role: "admin",
      isActive: true,
    },
    create: {
      username: "admin",
      password: hashedPassword,
      name: "Administrator",
      email: "khangmyfruit.contact@gmail.com",
      role: "admin",
      isActive: true,
    },
  });

  console.log("✅ Admin user created/updated:");
  console.log("   Username: admin");
  console.log("   Password: khangmyadmin@2025");
  console.log("   Email:", admin.email);
  console.log("   ID:", admin.id);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding admin user:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
