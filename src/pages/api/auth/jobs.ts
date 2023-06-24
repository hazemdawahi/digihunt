import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (req.method === 'POST') {
    const { 
      jobTitle, requirements, description, isRemote, 
      isFullTime, isInternship, location, salary, industry, 
      role, skills, education, experience
    } = req.body;

    const companyId = session?.user?.id.toString();
    const newJob = await prisma.job.create({
      data: {
        jobTitle,
        requirements,
        description,
        isRemote,
        isFullTime,
        isInternship,
        location,
        salary,
        industry,
        role,
        expiryDate: new Date(),
        education,
        experience,
        company: {
          connect: {
            id: companyId
          }
        },
        jobSkills: {
          create: skills.map((skillName: string) => ({
            skill: {
              connectOrCreate: {
                create: {
                  name: skillName
                },
                where: {
                  name: skillName
                }
              }
            }
          }))
        }
      },
    });

    return res.status(200).json(newJob);
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
