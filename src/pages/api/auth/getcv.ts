/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const userId = req.query.userId; // Assuming user id is passed as a query parameter
  const data = await prisma.resume.findFirst({
    where: {
      id: parseInt(userId)
    },
  });
  res.json(data);
}