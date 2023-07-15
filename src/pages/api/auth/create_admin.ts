import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const { firstname, lastname, email, password: plainTextPassword, image } = req.body;
  const hashedPassword = await bcrypt.hash(plainTextPassword, 10);

  const existingAdmin = await prisma.admins.findFirst({
    where: { email: email } as any,
  });

  if (existingAdmin) {
    res.status(409).json({ message: 'Email already taken' });
    return;
  }

  const admin = await prisma.admins.create({
    data: {
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: hashedPassword,
      image: image,
      role: 'admin',
      isVerified: false,
    },
  });

  res.status(201).json({ admin });
}
