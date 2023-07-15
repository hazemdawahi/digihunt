import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    const { id } = req.query;
  
    if (req.method === "GET") {
      const users = await prisma.users.findMany();
      res.status(200).json(users);
    } else if (req.method === "DELETE") {
      if (!id) {
        return res.status(400).json({ error: 'Missing user id' });
      }
      const user = await prisma.users.delete({ where: { id: Number(id) } });
      res.status(200).json(user);
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  }