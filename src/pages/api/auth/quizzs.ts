/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from '@prisma/client';
import { getSession } from "next-auth/react";
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get the user's session
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }
    const userId = session.user.id;

    if (req.method === "POST") {
      // Get the request body
      const { exerciseTitle, correct, incorrect } = req.body;

      // Create a new QuizData record for the user
      const quizData = await prisma.quizData.create({
        data: {
           userId :parseInt(req.body.userId),

          exerciseTitle: exerciseTitle,
          correct: correct,
          incorrect: incorrect,
        },
      });

      // Create a new QuizHistory record for the user
      const quizHistory = await prisma.quizHistory.create({
        data: {
          userId : parseInt(req.body.userId),

          exerciseTitle: exerciseTitle,
          score: correct,
        },
      });

      // Send a success response
      res.status(200).json({ success: true });
    } else if (req.method === "GET") {
      // Get the user's QuizHistory records
      const quizHistory = await prisma.quizHistory.findMany({
        where: {
           userId : parseInt(req.body.userId),

        },
      });

      // Get the user's QuizData records
      const quizData = await prisma.quizData.findMany({
        where: {
           userId : parseInt(req.body.userId),

        },
      });

      // Send the quiz history and data back to the client
      res.status(200).json({ quizHistory, quizData });
    } else {
      res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to process request" });
  }
}
