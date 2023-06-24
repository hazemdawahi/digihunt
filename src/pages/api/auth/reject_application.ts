import { PrismaClient } from '@prisma/client';

import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const applicationId = req.body.id;
  
    if (req.method === 'POST') {
      try {
        const application = await prisma.application.update({
          where: { id: applicationId },
          data: { status: 'rejected' },
          include: { user: true, job: true }
        });
  
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
          from: 'hazem.dawahi@esprit.tn',
          to: application.user.email,
          subject: 'Your application has been rejected',
          text: `We regret to inform you that your application for the position ${application.job.jobTitle} has been rejected.`,
          html: `<p>We regret to inform you that your application for the position ${application.job.jobTitle} has been rejected.</p>`
        };
  
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
            res.status(500).json({ error: 'Failed to send email' });
          } else {
            console.log('Email sent: ' + info.response);
            res.status(200).json({ message: 'Application rejected and email sent' });
          }
        });
  
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    } else {
      res.status(405).json({ error: 'We only support POST' });
    }
  }