import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Validate userId
      if (!req.query.userId || isNaN(Number(req.query.userId))) {
        return res.status(400).json({ error: 'Invalid userId' });
      }
      
      const userId = Number(req.query.userId);

      // Fetch quiz history for the given user
      const quizHistories = await prisma.quizHistory.findMany({
        where: {
          userId: userId,
        },
        include: {
          user: true,
        },
      });

      // Fetch the corresponding quizzes
      const quizzes = await Promise.all(
        quizHistories.map((history) =>
          prisma.quiz.findUnique({
            where: {
              id: history.quizId,
            },
            include: {
              questions: true,
            },
          })
        )
      );

      // Combine quiz history and quiz data
      const result = quizHistories.map((history, i) => ({
        ...history,
        quiz: quizzes[i],
      }));

      res.status(200).json(result);
    } catch (error) {
      console.error(error); // Log the error details
      res.status(500).json({ error: 'Unable to fetch quiz history and quizzes', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
