import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
      try {
        const quizzes = await prisma.quiz.findMany({
          include: {
            questions: true
          },
        })
  
        // Transform quizzes and questions into a flat array
        const questions = quizzes.flatMap((quiz) => {
          return quiz.questions.map((question) => {
            return {
              id: question.id,
              quizTitle: quiz.title, // include the quiz title
              exerciseId: quiz.id,
              question: question.question,
              answers: JSON.parse(question.answers), // Parse JSON string into an array
              correctAnswer: question.correctAnswer
            }
          })
        })
  
        res.status(200).json(questions)
      } catch (error) {
        res.status(500).json({ error: 'Unable to fetch quizzes' })
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  }
  