/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'PUT') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }
  const { firstname, lastname, email, password: plainTextPassword, role, location } = req.body;

  // Check if user exists
  const existingUser = await prisma.users.findUnique({
    where: {
      email: email
    }
  })
  
  if (!existingUser) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  
  // Update user data
  let data = {
    firstname: firstname,
    lastname: lastname,
    location: location,
    role: role,
    password: '',
    email:email
  };
  
  if (email && email !== existingUser.email) {
    const existingEmailUser = await prisma.users.findUnique({
      where: { email: email },
    });
  
    if (existingEmailUser) {
      res.status(409).json({ message: 'Email already taken' });
      return;
    }
   

    data = {
      ...data,
      email: email,
    };
  
  }
  
  if (plainTextPassword) {
    const password = await bcrypt.hash(plainTextPassword, 10);
    data = {
      ...data,
      password: password,
    };
  }
  
  const updatedUser = await prisma.users.update({
    where: { email: email },
    data: data,
  });
  
  res.status(200).json({ user: updatedUser });
}