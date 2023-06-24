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

  const { companyname,industry, email, password: plainTextPassword, role,location } = req.body;
  console.log(req.body)
  const password = await bcrypt.hash(plainTextPassword, 10);
console.log(email);
  const existingUser = await prisma.users.findFirst({
    where: { email: email } as any,
  });
  const existingcompanies = await prisma.companies.findFirst({
    where: { email: email } as any,
  });
console.log(existingUser)
  if (existingUser && existingcompanies) {
    res.status(409).json({ message: 'Email already taken' });
    return;
  }
  const image ="https://api.dicebear.com/5.x/initials/png?seed="+companyname
  const company = await prisma.companies.create({
    data: {
      company_name: companyname,
      industry:industry,
      image:image,
      location:location,
      email: email,
      password: password,
      role: role
    },
  });

  res.status(201).json({ company });
}
