import { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'db4uc5d2l',
  api_key: '941549514167314',
  api_secret: 'N9hk7kGgzpqdqBfLuw_JNDXzOT0',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const file = req.body.file;
    try {
      const uploadResponse = await cloudinary.uploader.upload(file, {
        upload_preset: 'azpvpkex' // Replace with your Cloudinary upload preset
      });

      res.status(200).json({ url: uploadResponse.secure_url });
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      res.status(500).json({ error: 'Error uploading to Cloudinary' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
