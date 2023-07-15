import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    const { id } = req.query;
  
    if (req.method === "GET") {
      const companies = await prisma.companies.findMany();
      res.status(200).json(companies);
    } else if (req.method === "DELETE") {
      if (!id) {
        return res.status(400).json({ error: 'Missing company id' });
      }
      const company = await prisma.companies.delete({ where: { id: String(id) } });
      res.status(200).json(company);
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  }