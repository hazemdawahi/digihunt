import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type ResumeData = {
  user: number;
  image: string,
  firstname:string,
  lastname:string,
  job: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  skype: string;
  twitter: string;
  linkedin: string;
  facebook: string;
  profile: string;
  first_date_start: string;
  first_date_end: string;
  first_loc: string;
  first_company_work: string;
  first_work: string;
  second_date_start: string;
  second_date_end: string;
  second_company_work: string;
  second_company_name: string;
  second_work: string;
  third_date_start: string;
  third_date_end: string;
  third_company_work: string;
  third_company_name: string;
  third_work: string;
  first_date_start_edu: string;
  first_date_end_edu: string;
  first_edu: string;
  first_education: string;
  second_date_start_edu: string;
  second_date_end_edu: string;
  second_edu: string;
  skill_1: string;
  slider_1: string;
  skill_2: string;
  slider_2: string;
  skill_3: string;
  slider_3: string;
  skill_4: string;
  slider_4: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const {
        user,
        image,
        firstname,
        lastname,
        job,
        country,
        phone,
        email,
        website,
        skype,
        twitter,
        linkedin,
        facebook,
        profile,
        first_date_start,
        first_date_end,
        first_loc,
        first_company_work,
        first_work,
        second_date_start,
        second_date_end,
        second_company_work,
        second_company_name,
        second_work,
        third_date_start,
        third_date_end,
        third_company_work,
        third_company_name,
        third_work,
        first_date_start_edu,
        first_date_end_edu,
        first_edu,
        first_education,
        second_date_start_edu,
        second_date_end_edu,
        second_edu,
        skill_1,
        slider_1,
        skill_2,
        slider_2,
        skill_3,
        slider_3,
        skill_4,
        slider_4,
      }: ResumeData = req.body;
console.log("body",req.body)
      const existingUser = await prisma.users.findUnique({
        where: { id: user },
        include: { resume: true }, // Include 'resume' relation

      });

      if (existingUser && existingUser.resume) {
        const updatedResume = await prisma.resume.update({
          where: { id: existingUser.resume.id },
          data: {
            image,
            firstname,
            lastname,
            job,
            country,
            phone,
            email,
            website,
            skype,
            twitter,
            linkedin,
            facebook,
            profile,
            first_date_start,
            first_date_end,
            first_loc,
            first_company_work,
            first_work,
            second_date_start,
            second_date_end,
            second_company_work,
            second_company_name,
            second_work,
            third_date_start,
            third_date_end,
            third_company_work,
            third_company_name,
            third_work,
            first_date_start_edu,
            first_date_end_edu,
            first_edu,
            first_education,
            second_date_start_edu,
            second_date_end_edu,
            second_edu,
           skill_1,
            slider_1,
            skill_2,
            slider_2,
            skill_3,
            slider_3,
            skill_4,
            slider_4,
          },
        });
        res.status(200).json({ message: "Resume updated successfully", data: updatedResume });
      } else if (existingUser) {
        const newResume = await prisma.resume.create({
          data: {
            image,
            firstname,
            lastname,
            job,
            country,
            phone,
            email,
            website,
            skype,
            twitter,
            linkedin,
            facebook,
            profile,
            first_date_start,
            first_date_end,
            first_loc,
            first_company_work,
            first_work,
            second_date_start,
            second_date_end,
            second_company_work,
            second_company_name,
            second_work,
            third_date_start,
            third_date_end,
            third_company_work,
            third_company_name,
            third_work,
            first_date_start_edu,
            first_date_end_edu,
            first_edu,
            first_education,
            second_date_start_edu,
            second_date_end_edu,
            second_edu,
            skill_1,
            slider_1,
            skill_2,
            slider_2,
            skill_3,
            slider_3,
            skill_4,
            slider_4,
            user: {
              connect: {
                id: user
              }
            }
          },
        });
        res.status(200).json({ message: "New resume created", data: newResume });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: "Something went bad", error: error });
    }
  } else if (req.method === "GET") {
    try {
      const allResumes = await prisma.resume.findMany({
        include: {
          user: true
        }
      });
      res.status(200).json({ data: allResumes });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: "Something went wrong", error: error });
    }
  } else {
    res.status(404).json({ message: "API endpoint not found" });
  }
}
