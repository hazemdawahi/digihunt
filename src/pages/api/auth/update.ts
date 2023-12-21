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

  const { email, password: plainTextPassword, role, ...rest } = req.body;

  // Check if it's a company or user update based on role
  if (role === 'company') {
    // Handling company updates
    const existingCompany = await prisma.companies.findUnique({
      where: { email: email }
    });

    if (!existingCompany) {
      res.status(404).json({ message: 'Company not found' });
      return;
    }

    let companyData = {
      company_name: rest.company || existingCompany.company_name,
      industry: rest.industry || existingCompany.industry,
      location: rest.location || existingCompany.location,
      email: rest.email || existingCompany.email,
      ...(plainTextPassword && { password: await bcrypt.hash(plainTextPassword, 10) }),
    };

    const updatedCompany = await prisma.companies.update({
      where: { email: email },
      data: companyData,
    });

    res.status(200).json({ company: updatedCompany });

  } else if (role === 'employee') {
    // Handling user updates
    const existingUser = await prisma.users.findUnique({
      where: { email: email }
    });

    if (!existingUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    let userData = {
      firstname: rest.firstname || existingUser.firstname,
      lastname: rest.lastname || existingUser.lastname,
      location: rest.location || existingUser.location,
      email: rest.email || existingUser.email,
      ...(plainTextPassword && { password: await bcrypt.hash(plainTextPassword, 10) }),
    };

    const updatedUser = await prisma.users.update({
      where: { email: email },
      data: userData,
    });

    res.status(200).json({ user: updatedUser });

  } else {
    res.status(400).json({ message: 'Invalid role' });
  }
}
