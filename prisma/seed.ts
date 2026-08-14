import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Check if admin user exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@plc.com" },
  });

  if (!existingAdmin) {
    const adminPasswordHash = await bcrypt.hash("admin123", 10);
    const admin = await prisma.user.create({
      data: {
        email: "admin@plc.com",
        fullName: "PLC Admin",
        passwordHash: adminPasswordHash,
        role: "ADMIN",
      },
    });
    console.log("Created Admin:", admin.email);
  } else {
    console.log("Admin user already exists.");
  }

  // Check if teacher user exists
  const existingTeacher = await prisma.user.findUnique({
    where: { email: "teacher@plc.com" },
  });

  if (!existingTeacher) {
    const teacherPasswordHash = await bcrypt.hash("teacher123", 10);
    const teacher = await prisma.user.create({
      data: {
        email: "teacher@plc.com",
        fullName: "Sok Sophea",
        passwordHash: teacherPasswordHash,
        role: "TEACHER",
      },
    });
    console.log("Created Teacher:", teacher.email);
  } else {
    console.log("Teacher user already exists.");
  }

  console.log("Seeding process completed!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
