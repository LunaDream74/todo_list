const { PrismaClient } = require('@prisma/client');

declare global {
  var prisma: any | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;
