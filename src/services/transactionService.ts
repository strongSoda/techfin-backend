import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// test
await prisma.transaction.create({
  data: {
    payee: "Amazon",
    amount: 123.45,
    category: "Shopping",
    date: new Date(),
    userId: "some-user-id",
  },
});
