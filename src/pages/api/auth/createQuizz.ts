import { Prisma, PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

type ApiResponse =
| { status: 'success'; quizId: number }
| { status: 'error'; message: string };

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  console.log(req.method)
  if (req.method === 'POST') {
    const { quizTitle, questions, quizType, companyId, timeInMins, level, questionNum } = req.body;
    console.log("quizTitle",quizTitle)
    try {
      const result = await prisma.$transaction(async (prisma) => {
        const quiz = await prisma.quiz.create({ 
          data: { 
            title: quizTitle, 
            type: quizType, 
            companyId: companyId,
            timeInMins: parseInt(timeInMins),  // Convert string to integer
            level: level,
            questionNum: questionNum
          } 
        })


        for (let question of questions) {
          await prisma.question.create({
            data: {
              question: question.question,
              answers: JSON.stringify(question.answers),
              correctAnswer: question.correctAnswer,
              quizId: quiz.id,
            },
          })
        }

        return quiz
      })

      res.status(200).json({ status: 'success', quizId: result.id })
    } catch (error) {
      console.error(error);
      const errorData = await error.response.json();
      console.log(errorData);
    } finally {
      async () => {
        await prisma.$disconnect()
      }
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}