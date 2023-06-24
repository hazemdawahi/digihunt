

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function handle(req, res) {
  const { id } = req.body;

  if (req.method === 'DELETE') {
    try {
      await prisma.application.delete({
        where: { id },
      });
      res.status(200).json({ message: 'Application deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Unable to delete the application' });
    }
  } else {
    res.status(405).end(); //Method Not Allowed
  }
}
