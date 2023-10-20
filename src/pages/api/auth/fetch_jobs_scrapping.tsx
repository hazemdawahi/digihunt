// pages/api/fetchJobs.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            // Fetch the data from job_scrapping table and include company data
            const fetchedJobs = await prisma.job_scrapping.findMany({
                include: {
                    company: true
                }
            });

            // Map the fetched data to the desired format
            const jobs = fetchedJobs.map(job => ({
                id: job.id,
                jobTitle: job.jobTitle,
                salaryType: job.salaryType,
                isRemote: job.isRemote,
                isFullTime: job.isFullTime,
                isInternship: job.isInternship,
                requirements: job.requirements,
                description: job.description,
                expiryDate: job.expiryDate,
                postDate: job.postDate,
                companyId: job.companyId,
                location: job.location,
                experience: job.experience,
                education: job.education,
                salary: job.salary,
                 url: job.url,
                company: {
                    id: job.company.id,
                    name: job.company.name,
                    image: job.company.image,
                    // Add other company fields as necessary
                }
            }));

            return res.status(200).json({ success: true, data: jobs });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, error: `An error occurred while fetching jobs: ${error.message}` });
        }
    } else {
        return res.status(405).json({ success: false, error: 'Method not allowed.' });
    }
}
