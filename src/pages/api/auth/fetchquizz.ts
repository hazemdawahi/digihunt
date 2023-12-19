import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Fetching the quiz history
      const quizHistories = await prisma.quizHistory.findMany({
        select: {
          quizId: true,
        },
      });

      // Extracting quiz IDs from history
      const quizIds = quizHistories.map((history) => history.quizId);

      // Fetching quizzes not taken, based on history
      const quizzes = await prisma.quiz.findMany({
        where: {
          id: {
            notIn: quizIds,
          },
        },
        include: {
          questions: true,
          company: true,
          jobQuizzes: true,
        },
      });

      if (quizzes.length === 0) {
        return res.status(200).json({ message: 'No more quizzes available' });
      }

      // Structuring each quiz with its questions
      const structuredQuizzes = quizzes.map(quiz => {
        return {
          quizId: quiz.id,
          quizTitle: quiz.title,
          type: quiz.type,
          timeInMins: quiz.timeInMins,
          level: quiz.level,
          questionNum: quiz.questionNum,
          company: quiz.company,
          jobQuizzes: quiz.jobQuizzes,
          questions: quiz.questions.map(question => {
            return {
              questionId: question.id,
              questionText: question.question,
              answers: JSON.parse(question.answers),
              correctAnswer: question.correctAnswer,
              // Include other question properties if needed
            };
          })
        };
      });

      res.status(200).json(structuredQuizzes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Unable to fetch quizzes', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
