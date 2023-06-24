import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

type Data = {
  jobs: Array<Object>;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'GET') {
    const jobs = await prisma.job.findMany({
      include: {
        company: true, // Include company details in the response
        jobSkills: {
          include: {
            skill: true, // Include skill details in the response
          },
        },
      },
    });
    res.status(200).json({ jobs });
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
