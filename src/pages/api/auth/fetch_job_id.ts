import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

type Data = {
  job: Object;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'GET') {
    const { id } = req.query; // Get id from query parameters

    if (!id) {
      return res.status(400).json({ error: "Missing job id" });
    }

    const job = await prisma.job.findUnique({
      where: {
        id: id as string, // Use id to find the job
      },
      include: {
        company: true, // Include company details in the response
        jobSkills: {
          include: {
            skill: true, // Include skill details in the response
          },
        },
      },
    });

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.status(200).json({ job });
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
