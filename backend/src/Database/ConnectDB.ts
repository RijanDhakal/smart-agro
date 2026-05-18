import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("Prisma connected sucessfully ");
  } catch (error) {
    console.log("DB error : ", error);
    process.exit(1);
  }
};

export { connectDB , prisma };
