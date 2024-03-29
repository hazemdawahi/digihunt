import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

// Configure nodemailer
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "hazem.dawahi@esprit.tn",
    pass: "hybsnpjcakghopup",
  },
});

// This function should be implemented to send an email
async function sendEmail(to: string, subject: string, body: string) {
  const mailOptions = {
    from: "hazem.dawahi@esprit.tn",
    to,
    subject,
    html: body, // use 'html' instead of 'text'
  };

  return transporter.sendMail(mailOptions);
}


async function userMatchesJob(user: any, job: any) {
  // Fetch user's resume
  const resume = await prisma.resume.findUnique({ where: { userId: user.id } });
  
  // Check if resume exists
  if (!resume) {
    return false;
  }

  // Splitting user skills into an array of individual skills
  const userSkills = [resume.skill_1, resume.skill_2, resume.skill_3, resume.skill_4]
    .filter(Boolean) // Ignore null or undefined
    .flatMap(s => s.split(/[\s,]+/)) // Split skills by spaces or commas
    .map(skill => skill.trim().toLowerCase()); // Trim and convert to lower case for case-insensitive comparison
  console.log("userSkills", userSkills);

  const jobSkills = job.jobSkills.map(js => js.skill.name.toLowerCase()); // Assuming jobSkills is an array of objects with a 'skill' property that has a 'name', converted to lower case
  console.log("jobSkills", jobSkills);

  // Check if any job skills are present in user skills
  const match = jobSkills.some(jobSkill => userSkills.includes(jobSkill));
  console.log("match", match);

  // Additional comparisons can be added here

  return match;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (req.method === 'POST') {
    const { 
      jobTitle, requirements, description, isRemote, 
      isFullTime, isInternship, location, salary, industry, 
      role, skills, education, experience,quizId
    } = req.body;
    console.log("quizId",quizId)

    const companyId = session?.user?.id.toString();

    let jobData:any = {
      jobTitle,
      requirements,
      description,
      isRemote,
      isFullTime,
      isInternship,
      location,
      salary,
      industry,
      role,
      expiryDate: new Date(),
      education,
      experience,
      company: {
        connect: {
          id: companyId
        }
      },
      jobSkills: {
        create: skills.map((skillName: string) => ({
          skill: {
            connectOrCreate: {
              create: {
                name: skillName
              },
              where: {
                name: skillName
              }
            }
          }
        }))
      },
    };

    // Add jobQuizzes only if quizId is valid
    if (quizId !== undefined && quizId !== null && quizId.trim() !== "") {
      jobData.jobQuizzes = {
        create: {
          quiz: {
            connect: {
              id: parseInt(quizId)
            }
          }
        }
      };
    }

    const newJob = await prisma.job.create({
      data: jobData,
      include: {
        jobSkills: {
          include: {
            skill: true,
          }
        }
      }
    });

    // Get all users
    const users = await prisma.users.findMany();

    // For each user, check if they match the job and if so, send them an email
    for (const user of users) {
      if (await userMatchesJob(user, newJob)) {
        console.log("user_math",user)
        await sendEmail(
          user.email,
          "New Job Posting That Matches Your Profile",
          `
          <h1>A new job has been posted that matches your profile</h1>
          <p><strong>Job Title:</strong> ${newJob.jobTitle}</p>
          <p><strong>Location:</strong> ${newJob.location}</p>
          <p><strong>Description:</strong> ${newJob.description}</p>
          <p>Click <a href="http://localhost:3000/offers/${newJob.id}">here</a> to view the job posting.</p>
          `
        );
      }
    }

    return res.status(200).json(newJob);
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
