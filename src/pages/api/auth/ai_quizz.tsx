import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: "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"
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { topic, numberOfQuestions, difficulty } = req.body;
       
        const defaultModel = 'gpt-3.5-turbo';
        const model = difficulty || defaultModel;

        const numQuestions = Number(numberOfQuestions) || 5;
console.log("numQuestions", numQuestions)
        const prompt = `Provide ${numQuestions} on the ${topic} ${difficulty} multiple-choice questions with options and correct answers.`;
console.log(prompt)
        try {
            const chatCompletion = await openai.chat.completions.create({
                messages: [{ role: 'user', content: prompt }],
                model: model, // Use the model defined by difficulty or default model.
            });
    
            const responseContent = chatCompletion.choices[0].message.content;
            console.log(responseContent)
            const parsedQuestions = parseQuestions(responseContent);
            res.status(200).json({ questions: parsedQuestions });
    
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ message: 'Error occurred' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}

function parseQuestions(rawString: string) {
    // Split the string by numbers followed by a period to get individual questions.
    const rawQuestions = rawString.split(/\d+\./).slice(1);
    
    return rawQuestions.map(q => {
        const lines = q.trim().split("\n");
        const question = lines[0].trim();
        const correctAnswerLine = lines.find(line => line.startsWith("Correct answer:"));
        const correctAnswer = correctAnswerLine ? correctAnswerLine.split(": ")[1].split(") ")[1] : "Error Parsing";
        const options = lines.slice(1, lines.indexOf(correctAnswerLine)).map(l => l.split(") ")[1]).filter(l => l);
    
        return {
            question,
            options,
            correctAnswer
        };
    });
}
