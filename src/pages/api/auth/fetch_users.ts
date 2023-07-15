import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    if (req.method === "GET") {
      const users = await prisma.users.findMany();
      res.status(200).json(users);
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  }