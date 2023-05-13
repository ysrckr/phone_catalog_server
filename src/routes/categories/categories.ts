import express from 'express';
import { getAll } from '../../controllers/categories';

export const router = express.Router();

router.get('/', getAll);