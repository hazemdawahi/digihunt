/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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

  const { 
    firstname, 
    lastname, 
    email, 
    password: plainTextPassword, 
    role, 
    location, 
    profileImageUrl 
  } = req.body;

  const password = await bcrypt.hash(plainTextPassword, 10);

  const existingUser = await prisma.users.findFirst({
    where: { email: email } as any,
  });

  const existingcompanies = await prisma.companies.findFirst({
    where: { email: email } as any,
  });

  if (existingUser && existingcompanies) {
    res.status(409).json({ message: 'Email already taken' });
    return;
  }

  const defaultImage = "https://api.dicebear.com/5.x/initials/png?seed=" + firstname;
  const image = profileImageUrl || defaultImage;

  const user = await prisma.users.create({
    data: {
      firstname: firstname,
      lastname: lastname,
      image: image,
      location: location,
      email: email,
      password: password,
      role: role
    },
  });

  res.status(201).json({ user });
}
