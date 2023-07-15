import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    const { id } = req.query;
  
    if (req.method === "GET") {
      const quizzes = await prisma.quiz.findMany();
      res.status(200).json(quizzes);
    } else if (req.method === "DELETE") {
      if (!id) {
        return res.status(400).json({ error: 'Missing quiz id' });
      }
      const quiz = await prisma.quiz.delete({ where: { id: Number(id) } });
      res.status(200).json(quiz);
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  }