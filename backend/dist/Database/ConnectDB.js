"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = exports.connectDB = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.prisma = prisma;
const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log("Prisma connected sucessfully ");
    }
    catch (error) {
        console.log("DB error : ", error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
