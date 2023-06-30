import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {

      const quizHistories = await prisma.quizHistory.findMany({
        select: {
          quizId: true,
        },
      });

      const quizIds = quizHistories.map((history) => history.quizId);

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

      const questions = quizzes.flatMap((quiz) => {
        return quiz.questions.map((question) => {
          return {
            id: question.id,
            quizTitle: quiz.title,
            exerciseId: quiz.id,
            question: question.question,
            answers: JSON.parse(question.answers),
            correctAnswer: question.correctAnswer,
            company: quiz.company,
            type: quiz.type,
            timeInMins: quiz.timeInMins,
            level: quiz.level,
            questionNum: quiz.questionNum,
            jobQuizzes: quiz.jobQuizzes,
          };
        });
      });

      res.status(200).json(questions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Unable to fetch quizzes', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
