import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: ""
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { topic, numberOfQuestions, difficulty } = req.body;
       
        const defaultModel = 'gpt-3.5-turbo';

        const numQuestions = Number(numberOfQuestions) || 5;

        const prompt = `Provide details and ${numQuestions} questions for a ${difficulty} quiz on the topic "${topic}". Include quiz name, estimated time to complete, and type (either psychometric or skill set), along with multiple-choice questions with options and correct answers.`;

        try {
            const chatCompletion = await openai.chat.completions.create({
                messages: [{ role: 'user', content: prompt }],
                model: defaultModel,
            });
    
            const responseContent = chatCompletion.choices[0].message.content;
            console.log("Response Content:", responseContent);
            
            const parsedDetails = parseDetailsAndQuestions(responseContent, difficulty);
            console.log("Parsed Details:", parsedDetails);
            
            res.status(200).json(parsedDetails);
    
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ message: 'Error occurred' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}

function parseDetailsAndQuestions(rawString: string, difficulty: string) {
    if (typeof rawString !== 'string') {
        throw new Error('Invalid raw string provided');
    }

    const lines = rawString.trim().split("\n");

    let quizName, estimatedTime, type;

    for (const line of lines) {
        if (line.toLowerCase().includes("quiz name")) {
            quizName = line.split(": ")[1];
        } else if (line.toLowerCase().includes("estimated time")) {
            estimatedTime = line.split(": ")[1];
        } else if (line.toLowerCase().includes("type")) {
            type = line.split(": ")[1].trim().toLowerCase();
        }
    }

    // If any of the expected details are missing, throw an error
    if (!quizName || !estimatedTime || !type) {
        console.error("Error processing raw string:", rawString);
        throw new Error('Failed to parse details from raw string');
    }

    // Simplifying type checking
    if (type.includes("psychometric")) {
        type = "psychometric";
    } else if (type.includes("skill set")) {
        type = "skill set";
    } else {
        console.error(`Error processing raw string: ${rawString}`);
        throw new Error(`Unexpected quiz type: ${type}`);
    }

    const rawQuestions = rawString.split(/\d+\./).slice(1);

    const questions = rawQuestions.map(q => {
        const qLines = q.trim().split("\n");
        const question = qLines[0].trim();
        const correctAnswerLine = qLines.find(line => line.startsWith("Correct answer:"));
        const correctAnswer = correctAnswerLine ? correctAnswerLine.split(": ")[1].split(") ")[1] : "Error Parsing";
        const options = qLines.slice(1, qLines.indexOf(correctAnswerLine)).map(l => l.split(") ")[1]).filter(l => l);
    
        return {
            question,
            options,
            correctAnswer
        };
    });

    return {
        quizName,
        estimatedTime,
        type,
        difficulty,
        questions
    };
}
