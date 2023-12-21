import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
    
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { topic, numberOfQuestions, difficulty } = req.body;
       
        const defaultModel = 'gpt-3.5-turbo';
        const numQuestions = Number(numberOfQuestions) || 5;

        const prompt = `Provide details and ${numQuestions} questions for a ${difficulty} quiz on the topic "${topic}". Include quiz name, estimated time to complete, and type (either psychometric or skill set quiz), along with multiple-choice questions with options and correct answers.`;

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

    // Extract quiz details
    for (const line of lines) {
        const parts = line.split(": ");
        if (line.toLowerCase().includes("quiz name") && parts[1]) {
            quizName = parts[1].trim();
        } else if (line.toLowerCase().includes("estimated time") && parts[1]) {
            estimatedTime = parts[1].trim();
        } else if (line.toLowerCase().includes("type") && parts[1]) {
            type = parts[1].trim().toLowerCase();
        }
    }

    if (!quizName || !estimatedTime || !type) {
        throw new Error('Failed to parse details from raw string');
    }

    type = type.trim().toLowerCase();
    if (!["psychometric quiz", "skill set quiz"].includes(type)) {
        throw new Error(`Unexpected quiz type: ${type}`);
    }

    const rawQuestions = rawString.split(/\d+\./).slice(1);
    const questions = rawQuestions.map(q => {
        const qLines = q.trim().split("\n");
        const question = qLines[0].trim();
        const correctAnswerLine = qLines.find(line => line.includes("Correct answer:"));
        const options = qLines.slice(1, qLines.indexOf(correctAnswerLine)).map(l => l.split(") ")[1]?.trim()).filter(l => l);

        let correctAnswer = correctAnswerLine?.split(":")[1]?.trim().toLowerCase();
        let correctAnswerIndex = options.findIndex(option => option.toLowerCase() === correctAnswer);

        if (correctAnswerIndex === -1) {
            console.error(`Error parsing correct answer for question: ${question}`);
            correctAnswerIndex = 0;  // Fallback to the first option if parsing fails
        }

        const correctAnswerLabel = `Answer ${String.fromCharCode(65 + correctAnswerIndex)}`;

        return {
            question,
            options,
            correctAnswer: correctAnswerLabel
        };
    });
console.log("questions", questions,"quizName", quizName,"estimatedTime", estimatedTime,"type", type,"difficulty", difficulty)
    return {
        quizName,
        estimatedTime,
        type,
        difficulty,
        questions
    };
}
