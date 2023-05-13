import type { Request, Response } from 'express';
import {
  create as createProduct,
  remove as removeProduct,
  update as updateProduct,
} from '../services/products';
import {
  cloudinaryDefaultUploadOptions,
  uploadToCloudinary,
} from '../utils/uploadToCloudinary';

export const create = async (req: Request, res: Response) => {
  const { name, description, price, quantity, colors, sizes, category } =
    req.body;
  const images = req.files as Express.Multer.File[];

  if (
    !name ||
    !description ||
    !price ||
    !quantity ||
    !colors ||
    !sizes ||
    !category
  ) {
    return res.status(400).json({ error: 'Missing a value' });
  }

  if (images.length > 0) {
    const imagesCloudinary: string[] = [];

    const imagePaths = images.map(image => image.path);
    try {
      for (const imagePath of imagePaths) {
        const imageCloudinary = await uploadToCloudinary(
          imagePath,
          cloudinaryDefaultUploadOptions,
        );
        imagesCloudinary.push(imageCloudinary?.secure_url as string);
      }

      if (imagesCloudinary.length !== images.length) {
        return res.status(500).json({ error: 'Internal server error' });
      }

      const product = await createProduct({
        name,
        colors,
        sizes,
        description,
        price: Number(price),
        quantity: Number(quantity),
        images: [...imagesCloudinary],
        categoryId: category,
      });
      if (!product) {
        return res.status(500).json({ error: 'Internal server error' });
      }

      return res.status(201).json(product);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  try {
    const product = await createProduct({
      name,
      colors,
      sizes,
      description,
      price: Number(price),
      quantity: Number(quantity),
      images: [],
      categoryId: category,
    });
    return res.status(201).json(product);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Missing id' });
  }

  const { name, description, price, quantity, colors, sizes, category } =
    req.body;
  const images = req.files as Express.Multer.File[];

  try {
    const product = await updateProduct({
      id,
      name,
      description,
      price: Number(price),
      quantity: Number(quantity),
      colors,
      sizes,
      categoryId: category,
      images: images.map(image => image.path),
    });
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await removeProduct(id);
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
