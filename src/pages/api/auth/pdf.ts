/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// pages/api/generate-pdf.ts
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';
import path from 'path';
import fs from 'fs';
const prisma = new PrismaClient();
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Chart, ChartItem, LinearScale, CategoryScale,BarElement } from 'chart.js';
import { createCanvas } from 'canvas';
Chart.register(LinearScale, CategoryScale, BarElement);

const handler = nc<NextApiRequest, NextApiResponse>();

handler.post(async (req, res) => {
  try{
  // Fetch users from the database
  console.log("Received data:", req.body); // Log the received data

  const users = await prisma.users.findMany();

  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const { width, height } = page.getSize();

  const logoPath = path.join(process.cwd(), 'public/assets', 'digi.png'); // Update the path to match your logo file location
  const logoBytes = fs.readFileSync(logoPath);
  const logoImage = await pdfDoc.embedPng(new Uint8Array(logoBytes));
  const logoDims = logoImage.scale(0.05); // Adjust the scale according to your desired size

  // Draw the logo at the top right
  page.drawImage(logoImage, {
    x: width - logoDims.width - 30,
    y: height - logoDims.height - 30,
    width: logoDims.width,
    height: logoDims.height,
  });

  // Draw the title
  const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const titleFontSize = 20;
  page.drawText("Test Report", {
    x: 30,
    y: height - 50,
    font: titleFont,
    size: titleFontSize,
    color: rgb(0, 0, 0),
  });

  // User details
  const details = [
    { key: 'Name', value: `${users[0].firstname} ${users[0].lastname}` },
    { key: 'Email', value: users[0].email },
    { key: 'Date', value: new Date().toLocaleDateString() },
  ];

  // Quiz information
  const quizInfo = [
    { key: 'Type', value: 'Quiz' },
    { key: 'Language', value: 'French' },
    { key: 'Duration', value: '5 minutes' },
    { key: 'Number of Questions', value: '5' },
  ];
  const detailsTitleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const detailsTitleFontSize = 16;
  page.drawText("Details", {
    x: 30,
    y: height - 70,
    font: detailsTitleFont,
    size: detailsTitleFontSize,
    color: rgb(0, 0, 0),
  });
  const descriptionTitleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const descriptionTitleFontSize = 16;
  page.drawText("Description", {
    x: width / 2,
    y: height - 70,
    font: descriptionTitleFont,
    size: descriptionTitleFontSize,
    color: rgb(0, 0, 0),
  });
  // Add user details and quiz information to the PDF
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const textColor = rgb(0.5, 0.5, 0.5);
  const fontSize = 12;

  let offsetY = detailsTitleFontSize + 10;
  for (const detail of details) {
    const detailText = `${detail.key}: ${detail.value}`;
    page.drawText(detailText, {
      x: 30,
      y: height - 80 - offsetY,
      size: fontSize,
      font,
      color: textColor,
    });
    offsetY += fontSize + 10;
  }

  offsetY = descriptionTitleFontSize + 10;
  for (const info of quizInfo) {
    const quizInfoText = `${info.key}: ${info.value}`;
    page.drawText(quizInfoText, {
      x: width / 2,
      y: height - 80 - offsetY,
      size: fontSize,
      font,
      color: textColor,
    });
    offsetY += fontSize + 10;
  }
 
// Draw the "Questions & Answers" title
const questionsTitleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
const questionsTitleFontSize = 16;
page.drawText("Questions & Answers", {
  x: 30,
  y: height - offsetY - 100,
  font: questionsTitleFont,
  size: questionsTitleFontSize,
  color: rgb(0, 0, 0),
});

// Add questions, user answers, and correct answers to the PDF
offsetY = offsetY + 120;
let questionNumber = 1;
for (const question of req.body.questions) {
  const questionText = `Q${questionNumber}: ${question.question}`;
  page.drawText(questionText, {
    x: 30,
    y: height - offsetY,
    font,
    size: fontSize,
    color: textColor,
  });
  offsetY += fontSize + 5;

  const userAnswer = question.userAnswer.toUpperCase();
  const correctAnswer = question.correctAnswer.toUpperCase();

  const userAnswerText = `Your answer: ${userAnswer}`;
  const correctAnswerText = `Correct answer: ${correctAnswer}`;

  const userAnswerColor = userAnswer === correctAnswer ? rgb(0, 0.5, 0) : rgb(0.5, 0, 0);

  page.drawText(userAnswerText, {
    x: 30,
    y: height - offsetY,
    font,
    size: fontSize,
    color: userAnswerColor,
  });
  offsetY += fontSize + 5;

  page.drawText(correctAnswerText, {
    x: 30,
    y: height - offsetY,
    font,
    size: fontSize,
    color: textColor,
  });
  offsetY += fontSize + 10;

  questionNumber++;
}

// Draw a bar chart for correct and incorrect answers
const canvas = createCanvas(400, 200);
const ctx = canvas.getContext('2d');

const correctAnswersCount = req.body.score;
const incorrectAnswersCount = req.body.questions.length - correctAnswersCount;

const chart = new Chart(ctx as unknown as ChartItem, {
  type: 'bar',
  data: {
    labels: ['Correct', 'Incorrect'],
    datasets: [
      {
        data: [correctAnswersCount, incorrectAnswersCount],
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  },
  options: {
    scales: {
      y: {
        type: 'linear',
        beginAtZero: true,
      },
    },
  },
});
  

const chartImage = await pdfDoc.embedPng(new Uint8Array(canvas.toBuffer()));
const chartImageDims = { width: 400, height: 200 };

// Draw the chart image on the PDF
page.drawImage(chartImage, {
    x: page.getWidth() / 2 - chartImageDims.width / 2,
    y: height - offsetY - chartImageDims.height,
    width: chartImageDims.width,
    height: chartImageDims.height,
  });
  
  // Update offsetY for the next element
  offsetY += chartImageDims.height + 30;
  
  // Serialize the PDF to bytes
  const pdfBytes = await pdfDoc.save();

  // Set the appropriate response headers and send the PDF
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=test_report.pdf');
  res.send(Buffer.from(pdfBytes.buffer));

}
catch (error) {
  console.error('Error generating PDF:', error);
  res.status(500).json({ message: 'Error generating PDF', error: error.message });
}
});
export default handler;