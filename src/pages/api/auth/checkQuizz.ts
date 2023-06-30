import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { userId, jobId } = req.body;
    
    try {
      // Get quizzes associated with the job
      const jobQuizzes = await prisma.jobQuiz.findMany({
        where: {
          jobId: jobId
        },
        include: {
          quiz: true // Include the related Quiz model
        }
      });
      
      // Get user's quiz history
      const userQuizHistory = await prisma.quizHistory.findMany({
        where: {
          userId: userId
        },
      });
      
      // Check if user's quiz history includes all the job quizzes
      const userQuizIds = userQuizHistory.map(q => q.quizId);
      const jobQuizIds = jobQuizzes.map(q => q.quizId);
      const hasCompletedRequiredQuizzes = jobQuizIds.every(id => userQuizIds.includes(id));
  
      // Find missing quizzes
      const missingQuizIds = jobQuizIds.filter(id => !userQuizIds.includes(id));
      const missingQuizzes = jobQuizzes.filter(q => missingQuizIds.includes(q.quizId)).map(q => q.quiz.title); // Get the titles of the missing quizzes

      res.status(200).json({ hasCompletedRequiredQuizzes, missingQuizzes });
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Unable to check quiz history.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed. Please use POST.' });
  }
}
