import type { Request, Response } from 'express';
import { getAll as getAllCategories } from '../services/categories';

export const getAll = async (req: Request, res: Response) => {
  try {
    const categories = await getAllCategories();
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
