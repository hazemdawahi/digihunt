import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import AWS from 'aws-sdk';
import axios from 'axios';

const prisma = new PrismaClient();

AWS.config.update({
  region: process.env.AWS_REGION || 'us-east-2',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const { userId, videoFeedImage } = req.body;

    if (!userId || !videoFeedImage) {
      return res
        .status(400)
        .json({ error: 'User ID and video feed image are required.' });
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

    const userImageBase64 = Buffer.from(response.data, 'binary').toString(
      'base64'
    );

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

    return res.status(200).json({
      match: Boolean(data.FaceMatches && data.FaceMatches.length > 0),
    });
  } catch (error) {
    console.error('Error:', error);

    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error.',
    });
  }
}
