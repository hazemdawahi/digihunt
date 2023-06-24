import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const { userId, jobId } = req.body;
console.log("userId",userId)
console.log("jobId",jobId)
  if (req.method === "POST") {
    try {
        const application = await prisma.application.create({
          data: {
            userId,
            jobId,
          },
        });
      
        res.json(application);
      } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ error: "Failed to apply for job." });
      }
  } else {
    res.status(405).json({ error: "We only support POST" });
  }
}
