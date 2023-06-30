/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from '@prisma/client';
import { getSession } from "next-auth/react";
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
          const quizzes = await prisma.quiz.findMany({
            select: {
              id: true,
              title: true,
              type: true,
            },
          });
    
          res.status(200).json(quizzes);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Error fetching quizzes' });
        }
      } else {
        // Handle any other HTTP method
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
      }
    }