import z from 'zod';
import { prisma } from '../setup/dbConnection';

export const getAll = async () => {
  try {
    const products = await prisma.product.findMany();
    return products;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getById = async (id: string) => {
  const isValidId = z.string().uuid().safeParse(id).success;

  if (!isValidId) {
    throw new Error('Invalid id');
  }

  try {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    });
    return product;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const create = async ({
  name,
  description,
  colors,
  sizes,
  images,
  price,
  quantity,
  categoryId,
}: {
  name: string;
  description: string;
  colors: string[];
  sizes: string[];
  images: string[];
  price: number;
  quantity: number;
  categoryId: string;
}) => {
  const newProduct = {
    name,
    description,
    colors,
    sizes,
    images,
    price,
    quantity,
  };

  try {
    const createdProduct = await prisma.product.create({
      data: {
        ...newProduct,
        category: {
          connect: {
            id: categoryId,
          },
        },
      },
    });

    if (!createdProduct) {
      throw new Error('Could not create a product');
    }

    return createdProduct;
  } catch (error) {
    return new Error(error as string);
  }
};

export const update = async ({
  id,
  name,
  images,
  colors,
  sizes,
  description,
  price,
  quantity,
  categoryId,
}: {
  id: string;
  name: string;
  images: string[];
  colors: string[];
  sizes: string[];
  description: string;
  price: number;
  quantity: number;
  categoryId: string;
}) => {
  const isValidId = z.string().uuid().safeParse(id).success;
  const isValidName = z.string().min(1).safeParse(name).success;
  const isValidImages = z.array(z.string()).safeParse(images).success;
  const isValidColors = z.array(z.string()).safeParse(colors).success;
  const isValidSizes = z.array(z.string()).safeParse(sizes).success;
  const isValidDescription = z.string().min(1).safeParse(description).success;
  const isValidPrice = z.number().min(0).safeParse(price).success;
  const isValidQuantity = z.number().min(0).safeParse(quantity).success;
  const isValidCategoryId = z.string().uuid().safeParse(categoryId).success;

  if (
    !isValidId ||
    !isValidName ||
    !isValidImages ||
    !isValidColors ||
    !isValidSizes ||
    !isValidDescription ||
    !isValidPrice ||
    !isValidQuantity ||
    !isValidCategoryId
  ) {
    return { error: 'Invalid input' };
  }

  try {
    const product = await getById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    const prevImages = product.images;
    const prevColors = product.colors;
    const prevSizes = product.sizes;

    const newImages = [...prevImages, ...images];
    const newColors = [...prevColors, ...colors];
    const newSizes = [...prevSizes, ...sizes];

    const updatedProduct = await prisma.product.update({
      where: {
        id,
      },
      data: {
        name,
        images: newImages,
        colors: newColors,
        sizes: newSizes,
        description: description || '',
        price: price || 0,
        quantity: quantity || 0,
        category: {
          connect: {
            id: categoryId,
          },
        },
      },
    });
    return updatedProduct;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const remove = async (id: string) => {
  const isValidId = z.string().uuid().safeParse(id).success;

  if (!isValidId) {
    throw new Error('Invalid id');
  }

  try {
    await prisma.product.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
