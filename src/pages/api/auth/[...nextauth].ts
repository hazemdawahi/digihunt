/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from 'next-auth';
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from 'bcrypt';
import bcrypt from 'bcrypt';
import nodemailer from "nodemailer";

type UserWithVerificationCode = {
  id: number;
  fristname: string;
  lastname:string;
  location:string;
  image:string;
  email: string;
  role: string;
  verificationCode: string;
}

const prisma = new PrismaClient();

const sendVerificationCode = async (user: UserWithVerificationCode) => {
  const verificationCode = Math.floor(Math.random() * 1000000).toString().padStart(6, "0");

  // send verification code to user's email
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "hazem.dawahi@esprit.tn",
      pass: "hybsnpjcakghopup",
    },
  });

  const mailOptions = {
    from: "hazem.dawahi@esprit.tn",
    to: user.email,
    subject: "Verification Code",
    text: `Your verification code is ${verificationCode}.`,
  };

  await transporter.sendMail(mailOptions);

  // return user object with verification code
  return { ...user, verificationCode };
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials): Promise<UserWithVerificationCode> {
         let user
      user  = await prisma.users.findFirst({
          where: { email: credentials.email } as any,
        });
      if (!user)
      {
         user = await prisma.companies.findFirst({
          where: { email: credentials.email } as any,
        });

      }
        if (!user) {
          throw new Error('Invalid email or password');
        }

      
        // Compare password
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
      
        if (!isPasswordValid) {
          throw new Error('Invalid email or password');
        }
        // Check if user is verified
    
        // Generate verification code if it doesn't exist in the user object
          // Check if user is verified
          if (!user.verificationCode) {
            user = await sendVerificationCode(user);
            // Update user object with verification code in the database
            if (user.hasOwnProperty('firstname')) {
              await prisma.users.update({
                where: { id: user.id },
                data: { verificationCode: user.verificationCode }
              });
            } else if (user.hasOwnProperty('companyName')) {
              await prisma.companies.update({
                where: { id: user.id },
                data: { verificationCode: user.verificationCode }
              });
            }
          }
      
        // Return user object with verification code
        const userWithVerificationCode = {
          ...user,
          verificationCode: user.verificationCode
        } as unknown as UserWithVerificationCode;

        return userWithVerificationCode;
      }
      
    })
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = user;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token && token.user) {
        session.user = token.user;
      }
      return session;
    }
  }
})