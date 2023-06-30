import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const jobId = req.query.jobId as string; // Assuming you pass the jobId as a query parameter

  try {
    // Delete associated JobSkill records first
    await prisma.jobSkill.deleteMany({
      where: {
        jobId: jobId,
      },
    });

    // Delete associated JobQuiz records
    await prisma.application.deleteMany({
      where: {
        jobId: jobId,
      },
    });
    await prisma.jobQuiz.deleteMany({
      where: {
        jobId: jobId,
      },
    });

    // Delete the job from the database
    await prisma.job.delete({
      where: {
        id: jobId,
      },
    });

    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Failed to delete job', error);
    res.status(500).json({ error: 'Failed to delete job' });
  }
}
