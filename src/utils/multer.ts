import { Request } from 'express';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/temp/'));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const multerOptions = {
  storage,
  fileFilter(req: Request, file: Express.Multer.File, cb: any) {
    if (!file.mimetype.startsWith('image')) {
      console.log('Please upload an image');
      cb(new Error('Please upload an image'), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
};

export const upload = multer(multerOptions);
