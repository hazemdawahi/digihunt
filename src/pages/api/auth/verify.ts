/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, verification_code } = req.body;

  // query the user with the provided email
  const user = await prisma.users.findUnique({
    where: { email },
  });

  // check if the verification code matches
  if (user && user.verificationCode === verification_code) {
    // update the user to mark them as verified
    const updatedUser = await prisma.users.update({
        where: { email },
        data: { verificationCode: null, isVerified: true },
      });

    res.status(200).json({ message: 'Verification successful', user: updatedUser });
  } else {
    res.status(400).json({ message: 'Invalid verification code' });
  }
}
