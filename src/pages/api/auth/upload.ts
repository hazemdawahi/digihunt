import { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'db4uc5d2l',
  api_key: '941549514167314',
  api_secret: 'N9hk7kGgzpqdqBfLuw_JNDXzOT0',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const fileStr = req.body.data;
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: 'azpvpkex',
    });

    if (uploadResponse.error) {
      res.status(500).json({ error: 'Upload failed' });
    } else {
      res.status(200).json({ url: uploadResponse.url });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
