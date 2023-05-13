import express from 'express';
import { getAll, getById } from '../../controllers/products';

export const router = express.Router();

router.get('/', getAll);
router.get('/:id', getById);
