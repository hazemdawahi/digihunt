import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.pdf');
  }
});

const upload = multer({ storage: storage }).single('file');

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const file = req.file as Express.Multer.File;

    if (!file) {
      return res.status(400).json({ error: 'Please upload a file' });
    }

    // Return the full URL of the uploaded file
    res.status(200).json({ filePath: `http://localhost:3000/uploads/${file.filename}` });
  });
};

export default handler;
