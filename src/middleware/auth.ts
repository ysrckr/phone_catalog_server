import type { NextFunction,Request,Response } from 'express';
import { checkCache } from '../services/users';


export const checkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {

  const userId = req.headers.authorization;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const role = await checkCache(userId)
    if (!role) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (role !== 'ADMIN') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }

  next();
};
