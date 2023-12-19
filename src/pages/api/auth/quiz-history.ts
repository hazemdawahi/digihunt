import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { userId, quizId, exerciseTitle, score, questions, answers, timeSpent, tabSwitchCount, totalDuration, remainingTime, images } = req.body;
console.log("req.body", req.body)
      if (!(userId && quizId && exerciseTitle && score !== undefined)) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      let totalTabSwitches = 0;
      if (Array.isArray(tabSwitchCount)) {
        totalTabSwitches = tabSwitchCount.reduce((acc, curr) => acc + curr, 0);
      }

      const quizHistory = await prisma.quizHistory.create({
        data: {
          userId,
          quizId, 
          exerciseTitle,
          score,
          questions,
          answers,
          timeSpent,
          tabSwitchCount: totalTabSwitches,
          totalDuration,
          remainingTime,
          images,
        },
      });

      for (const question of questions) {
        await prisma.question.update({
          where: { id: question.id },
          data: { userAnswer: question.userAnswer },
        });
      }

      return res.status(200).json(quizHistory);
    } catch (error) {
      console.error("Error occurred in /api/submitQuiz:", error);
      if (error instanceof PrismaClientKnownRequestError) {
        // Handle specific Prisma errors (if any)
        return res.status(500).json({ error: "A database error occurred: " + error.message });
      } else {
        // Handle general errors
        return res.status(500).json({ error: "An error occurred while saving the quiz history: " + error.message });
      }
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
