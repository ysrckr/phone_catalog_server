import express from 'express';
import  { upload } from '../../utils/multer';

import {
  create as createCategory,
  remove as removeCategory,
} from '../../controllers/categoriesAdmin';

const singleUpload = upload.single('image');

export const router = express.Router();

router.post('/', singleUpload, createCategory);
router.delete('/:id', removeCategory);
