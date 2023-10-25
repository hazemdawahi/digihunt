import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import axios from 'axios';
import pdf from 'pdf-parse';

const DEFAULT_MODEL = 'gpt-3.5-turbo-16k';

const openai = new OpenAI({
    apiKey: "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"
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const pdfUrl = req.body.pdfUrl;
console.log("PDF URL:", pdfUrl)
        if (!pdfUrl) {
            return res.status(400).json({ message: 'Please provide a valid PDF URL in the request body.' });
        }

        try {
            // Extract text from PDF
            const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
            const data = await pdf(response.data);

            const prompt = `Given the following resume text, please categorize the information into the respective fields: firstname, lastname, job, country, email, phone, website, skype, twitter, linkedin, facebook, profile, first_date_start, first_date_end, first_loc, first_company_work, first_work, second_date_start, second_date_end, second_company_work, second_company_name, second_work, third_date_start, third_date_end, third_company_work, third_company_name, third_work, first_date_start_edu, first_date_end_edu, first_edu, first_education, second_date_start_edu, second_date_end_edu, second_edu, skill_1, slider_1, skill_2, slider_2, skill_3, slider_3, skill_4, slider_4. For the fields 'skill_1', 'skill_2', 'skill_3', and 'skill_4', provide only one distinct skill for each field. Also, for each skill, provide a corresponding 'slider' value between 1 and 10 representing expertise. Extract fields from the Resume Text: "${data.text}"`;

            const chatCompletion = await openai.chat.completions.create({
                messages: [{ role: 'user', content: prompt }],
                model: DEFAULT_MODEL,
            });
    
            const responseContent = chatCompletion.choices[0].message.content;
            const extractedData = parseResumeDetails(responseContent);
            
            res.status(200).json(extractedData);
    
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ message: 'Error occurred' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}

function parseResumeDetails(rawString: string): Record<string, string> {
    const lines = rawString.split("\n");
    const result: Record<string, string> = {};

    for (const line of lines) {
        const [key, value] = line.split(": ");
        if (key && value) {
            result[key.trim()] = value.trim();
        }
    }

    return result;
}
