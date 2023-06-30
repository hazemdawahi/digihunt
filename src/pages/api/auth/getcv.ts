// pages/api/resume/[id].ts
import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const userId = Number(req.query.userId)
console.log(userId)
  if (req.method === 'GET') {
    const resume = await prisma.resume.findUnique({
      where: {
        userId: userId
      }
    })

    if (!resume) {
      return res.status(404).json({ error: 'No resume found for this user ID' })
    }

    return res.status(200).json(resume)
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
