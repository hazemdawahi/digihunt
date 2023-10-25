import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import AWS from 'aws-sdk';
import axios from 'axios';

const prisma = new PrismaClient();

AWS.config.update({
  region: 'us-east-2',
  accessKeyId: 'AKIA5MBO65U6Q6MZT6NB',
  secretAccessKey: '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',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const { userId, videoFeedImage } = req.body;

    if (!userId || !videoFeedImage) {
      return res.status(400).json({ error: 'User ID and video feed image are required.' });
    }

    const user = await prisma.users.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user || !user.image) {
      return res.status(404).json({ error: 'User or user image not found.' });
    }

    const response = await axios.get(user.image, {
      responseType: 'arraybuffer',
    });

    const userImageBase64 = Buffer.from(response.data, 'binary').toString('base64');

    const rekognition = new AWS.Rekognition();

    const params = {
      SourceImage: {
        Bytes: Buffer.from(userImageBase64, 'base64'),
      },
      TargetImage: {
        Bytes: Buffer.from(videoFeedImage, 'base64'),
      },
      SimilarityThreshold: 90,
    };

    const data = await rekognition.compareFaces(params).promise();

    if (data.FaceMatches && data.FaceMatches.length > 0) {
      return res.status(200).json({ match: true });
    } else {
      return res.status(200).json({ match: false });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message || 'Internal server error.' });
  }
}
