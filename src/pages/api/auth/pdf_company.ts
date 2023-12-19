

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
import Jimp from "jimp";

import fs from 'fs';
const prisma = new PrismaClient();
import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { ChartItem, LinearScale, CategoryScale,BarElement } from 'chart.js';
import { createCanvas } from 'canvas';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
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
    y: height - logoDims.height - 10,
    width: logoDims.width,
    height: logoDims.height,
  });

  // Draw the title
  const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const titleFontSize = 20;
  page.drawText("Test Report", {
    x: 30,
    y: height - 30,
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
     { key: 'Duration', value: req.body.quiz.timeInMins + ' minutes' },
    { key: 'Number of Questions', value: req.body.quiz.questionNum },
  ];
  const detailsTitleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const detailsTitleFontSize = 16;
  page.drawText("Details", {
    x: 30,
    y: height - 75,
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
  const scorePercentage = (req.body.score / req.body.questions.length) * 100;

  // Adjust offsetY value to create space for the score text

  
  // Draw the score text on the page
  const scoreFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const scoreFontSize = 18;
  const scoreColor = scorePercentage >= 50 ? rgb(0, 0.5, 0) : rgb(0.5, 0, 0);
  const scoreText = `Score: ${scorePercentage.toFixed(1)}%`;
  page.drawText(scoreText, {
    x: width / 2 - (scoreText.length * scoreFontSize) / 4, // Center the score text
    y: height - offsetY - 90,
    font: scoreFont,
    size: scoreFontSize,
    color: scoreColor,
  });
// Draw the "Questions & Answers" title
const questionsTitleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
const questionsTitleFontSize = 16;
page.drawText("Questions & Answers", {
  x: 30,
  y: height - offsetY - 120,
  font: questionsTitleFont,
  size: questionsTitleFontSize,
  color: rgb(0, 0, 0),
});

offsetY = offsetY + 140;
let questionNumber = 1;
console.log("req.body.quiz.questions",req.body.quiz.questions);

for (const [index, question] of req.body.questions.entries()) {
  const questionText = `Q${index + 1}: ${question.question}`;
  page.drawText(questionText, {
    x: 30,
    y: height - offsetY,
    font,
    size: fontSize,
    color: textColor,
  });
  offsetY += fontSize + 5;

  const userAnswer = question.userAnswer.toUpperCase();
  const correctAnswerIndex = req.body.quiz.questions[index].correctAnswer.charCodeAt(0) - "a".charCodeAt(0);
  const correctAnswer = JSON.parse(req.body.quiz.questions[index].answers)[correctAnswerIndex].toUpperCase();

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
  offsetY += fontSize + 5;

  // Add tab changes and duration per question
  const tabChangesText = `Tab changes: ${question.tabChanges}`;
  const durationPerQuestionText = `Duration: ${question.durationPerQuestion}`;

  page.drawText(tabChangesText, {
    x: 30,
    y: height - offsetY,
    font,
    size: fontSize,
    color: textColor,
  });
  offsetY += fontSize + 5;

  page.drawText(durationPerQuestionText, {
    x: 30,
    y: height - offsetY,
    font,
    size: fontSize,
    color: textColor,
  });
  offsetY += fontSize + 10;
}


// Draw a bar chart for correct and incorrect answers
const chartPage = pdfDoc.addPage([600, 800]);
const canvas = createCanvas(350, 150);
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
const chartImageDims = { width: 350, height: 300 };

// Draw the chart image on the PDF
const chartOffsetY = 20;
chartPage.drawImage(chartImage, {
  x: chartPage.getWidth() / 2 - chartImageDims.width / 2,
  y: chartPage.getHeight() - chartOffsetY - chartImageDims.height,
  width: chartImageDims.width,
  height: chartImageDims.height,
});


async function getImageDataFromUrl(url) {
  try {
    // Fetch the image from the URL
    const response = await fetch(url);
    const imageBuffer = await response.buffer();

    // Read the image using Jimp
    const image = await Jimp.read(imageBuffer);
    const { width, height } = image.bitmap;

    // Convert the image to PNG buffer
    const pngBuffer = await image.getBufferAsync(Jimp.MIME_PNG);

    // Embed the PNG buffer into the PDF document
    const embeddedImage = await pdfDoc.embedPng(pngBuffer);

    return { image: embeddedImage, width, height };
  } catch (error) {
    console.error(`Error fetching or embedding image from URL: ${url}`);
    throw error;
  }
}


// ...


let imagesOffsetY = chartOffsetY + chartImageDims.height + 40;
let currentPage = chartPage;
const screenshotsTitleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
const screenshotsTitleFontSize = 16;
const screenshotsTitleText = "Screenshots";
const screenshotsTitleWidth = screenshotsTitleFont.widthOfTextAtSize(screenshotsTitleText, screenshotsTitleFontSize);
const screenshotsTitleX = (currentPage.getWidth() - screenshotsTitleWidth) / 2;
currentPage.drawText(screenshotsTitleText, {
  x: screenshotsTitleX,
  y: currentPage.getHeight() - imagesOffsetY,
  font: screenshotsTitleFont,
  size: screenshotsTitleFontSize,
  color: rgb(0, 0, 0),
  opacity: 0.8,
  rotate: degrees(0),
  xSkew: degrees(0),
  ySkew: degrees(0),
  lineHeight: 1,
});

imagesOffsetY += screenshotsTitleFontSize + 20;

// // Add the "User camera access denied" text
// const deniedTextFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
// const deniedTextFontSize = 12;
// const deniedText = "User camera access denied";
// const deniedTextWidth = deniedText.length * deniedTextFontSize;
// const deniedTextX = (currentPage.getWidth() - deniedTextWidth) / 2;
// currentPage.drawText(deniedText, {
//   x: deniedTextX,
//   y: currentPage.getHeight() - imagesOffsetY,
//   font: deniedTextFont,
//   size: deniedTextFontSize,
//   color: textColor,
// });

//imagesOffsetY += deniedTextFontSize + 20;

for (const image of req.body.images) {
  const imageData = await getImageDataFromUrl(image);

  if (imagesOffsetY + imageData.height > currentPage.getHeight() - 40) {
    // Create a new page if there is not enough space
    currentPage = pdfDoc.addPage([600, 800]);
    imagesOffsetY = 40;
  }

  const embeddedImage = imageData.image;
  const { width: imageWidth, height: imageHeight } = imageData;

  currentPage.drawImage(embeddedImage, {
    x: currentPage.getWidth() / 2 - imageWidth / 2,
    y: currentPage.getHeight() - imagesOffsetY - imageHeight,
    width: imageWidth,
    height: imageHeight,
  });

  imagesOffsetY += imageHeight + 20;
}
  // Serialize the PDF to bytes
  const pdfBytes = await pdfDoc.save();

  // Set the appropriate response headers and send the PDF
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=test_report.pdf");
  res.send(Buffer.from(pdfBytes.buffer));
} catch (error) {
  console.error("Error generating PDF:", error);
  res.status(500).json({ message: "Error generating PDF", error: error.message });
}
});

export default handler;