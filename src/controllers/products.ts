import { Request, Response } from 'express';
import { getAll as getAllProducts, getById as getOneProduct } from '../services/products';

export const getAll = async (req: Request, res: Response) => {
  try {
    const products = await getAllProducts();
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getById = async (req: Request, res: Response) => { 
  const { id } = req.params;

  try {
    const product = await getOneProduct(id);
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
