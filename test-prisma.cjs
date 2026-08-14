const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  try {
    const student = await prisma.student.create({
      data: {
        studentId: "STU-TEST-1",
        nameKh: "Test",
        gender: "Male",
        dob: new Date().toISOString()
      }
    });
    console.log("Success:", student);
    await prisma.student.delete({where:{id: student.id}});
  } catch (e) {
    console.error("Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
