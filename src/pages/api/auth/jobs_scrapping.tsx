import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import cheerio from 'cheerio';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const SCRAPEOPS_BASE_URL = 'https://proxy.scrapeops.io/v1/?api_key=2d322136-749a-458a-8e6d-5bde4b7d2980&url=';
const TANIT_JOBS_BASE_URL = 'https://www.tanitjobs.com/';

function getEncodedURL(page: number) {
    return SCRAPEOPS_BASE_URL + encodeURIComponent(`${TANIT_JOBS_BASE_URL}jobs/?page=${page}`);
}

function getJobDetailsURL(jobId: string) {
    return SCRAPEOPS_BASE_URL + encodeURIComponent(`${TANIT_JOBS_BASE_URL}job/${jobId}`);
}

function getOriginalJobURL(jobId: string) {
    return `${TANIT_JOBS_BASE_URL}job/${jobId}`;
}

function generateCompanyImageURL(companyName: string): string {
    const encodedName = encodeURIComponent(companyName);
    return `https://api.dicebear.com/5.x/initials/png?seed=${encodedName}`;
}

async function fetchWithoutRetry(url) {
    try {
        return await axios.get(url);
    } catch (error) {
        throw error;
    }
}

async function mapToDesiredFormat(jobDetails, jobId): Promise<any> {
    let company = await prisma.company_scrapping.create({
        data: {
            name: jobDetails.companyName || 'Unknown Company',
            image: generateCompanyImageURL(jobDetails.companyName || 'Unknown Company'),
        },
    });

    return {
        jobTitle: jobDetails.jobName,
        salaryType: 'Unknown',
        isRemote: false,
        isFullTime: jobDetails["Type d'emploi désiré :"] === "CDI",
        isInternship: false,
        requirements: jobDetails["Exigences de l'emploi"] || '',
        description: jobDetails["Description de l'emploi"] || '',
        expiryDate: new Date(jobDetails["Date d'expiration"]) || null,
        postDate: new Date(),
        companyId: company.id,
        location: jobDetails.jobLocation || 'Unknown Location',
        experience: 'Unknown Experience',
        education: jobDetails["Niveau d'étude :"] || 'Unknown Education',
        salary: 0,
        url: getOriginalJobURL(jobId),
    };
}

async function fetchJobDetails(jobId: string) {
    const link = getJobDetailsURL(jobId);
    const response = await fetchWithoutRetry(link);
    const $ = cheerio.load(response.data);

    const jobName = $(".details-header__title").text().trim();
    const companyName = $(".listing-item__info--item-company").text().trim();
    const jobLocation = $(".listing-item__info--item-location").text().trim();

    const postDetails = {};
    $(".infos_job_details .col-md-4").each((_, element) => {
        const key = $(element).find("dt").text().trim();
        const value = $(element).find("dd").text().trim();
        postDetails[key] = value;
    });

    const jobDescription = $(".details-body__title:contains('Description de l\\'emploi')").next().text().trim();
    const jobRequirements = $(".details-body__title:contains('Exigences de l\\'emploi')").next().text().trim();
    const expiryDate = $(".details-body__title:contains('Date d\\'expiration')").next().text().trim();

    return await mapToDesiredFormat({
        jobName,
        companyName,
        jobLocation,
        ...postDetails,
        "Description de l'emploi": jobDescription,
        "Exigences de l'emploi": jobRequirements,
        "Date d'expiration": expiryDate
    }, jobId);
}

async function processConcurrently<T, R>(items: T[], handler: (item: T) => Promise<R>, limit: number): Promise<R[]> {
    const results: R[] = [];
    const toProcess = [...items];

    const processNext = async (): Promise<void> => {
        if (toProcess.length === 0) return;
        const item = toProcess.shift();
        results.push(await handler(item));
        processNext();
    };

    const workers = new Array(limit).fill(null).map(() => processNext());
    await Promise.all(workers);

    return results;
}

async function fetchJobsByPage(page: number): Promise<any[]> {
    const response = await fetchWithoutRetry(getEncodedURL(page));
    const $ = cheerio.load(response.data);
    const jobIds: string[] = [];

    $('article').each((_, element) => {
        const jobId = $(element).attr('id');
        jobIds.push(jobId);
    });

    const jobs = await processConcurrently(jobIds, fetchJobDetails, 5);
    return jobs;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            // Check if there are records in the job_scrapping table
            const existingJobs = await prisma.job_scrapping.findMany();

            // If there are, delete them
            if (existingJobs.length > 0) {
                await prisma.job_scrapping.deleteMany();
                
                // Check if there are records in the company_scrapping table
                const existingCompanies = await prisma.company_scrapping.findMany();

                // If there are, delete them
                if (existingCompanies.length > 0) {
                    await prisma.company_scrapping.deleteMany();
                }
            }

            // Scrape and insert new records
            const jobsData = await fetchJobsByPage(1);
            const savedJobs = await prisma.job_scrapping.createMany({ data: jobsData });
            return res.status(200).json({ success: true, data: savedJobs });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, error: `An error occurred while fetching job data: ${error.message}` });
        }
    } else {
        return res.status(405).json({ success: false, error: 'Method not allowed.' });
    }
}
