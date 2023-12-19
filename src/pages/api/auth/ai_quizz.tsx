import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: "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"
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
    
            const responseContent = chatCompletion.choices[0]?.message?.content;
            
            if (!responseContent || typeof responseContent !== 'string') {
                throw new Error('Invalid response content from API');
            }

            const parsedDetails = parseDetailsAndQuestions(responseContent, difficulty);
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
    const lines = rawString.trim().split("\n");
    let quizName, estimatedTime, type;

    for (const line of lines) {
        const parts = line.split(": ");
        if (line.toLowerCase().includes("quiz name") && parts.length >= 2) {
            quizName = parts[1];
        } else if (line.toLowerCase().includes("estimated time") && parts.length >= 2) {
            estimatedTime = parts[1];
        } else if (line.toLowerCase().includes("type") && parts.length >= 2) {
            type = parts[1].trim().toLowerCase();
        }
    }

    // Validation for expected details
    if (!quizName || !estimatedTime || !type) {
        throw new Error('Failed to parse details from raw string');
    }

    // Parsing the quiz type
    if (type.includes("psychometric")) {
        type = "psychometric";
    } else if (type.includes("skill set")) {
        type = "skill set";
    } else {
        throw new Error(`Unexpected quiz type: ${type}`);
    }

    const rawQuestions = rawString.split(/\d+\./).slice(1);

    const questions = rawQuestions.map(q => {
        const qLines = q.trim().split("\n");
        const question = qLines[0].trim();
        const correctAnswerLine = qLines.find(line => line.startsWith("Correct answer:"));
        const correctAnswer = correctAnswerLine?.split(": ")[1]?.split(") ")[1] || "Error Parsing";
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
