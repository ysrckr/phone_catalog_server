import z from 'zod';
import { prisma } from '../setup/dbConnection';

export const getAll = async () => {
  try {
    const categories = await prisma.category.findMany();
    return categories;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getById = async (id: string) => {
  const isValidId = z.string().uuid().safeParse(id).success;

  if (!isValidId) {
    return { error: 'Invalid id' };
  }

  try {
    const category = await prisma.category.findUnique({
      where: {
        id,
      },
    });
    return category;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const create = async ({
  name,
  image,
}: {
  name: string;
  image?: string;
}) => {
  const isValidName = z.string().min(1).safeParse(name).success;

  if (!isValidName) {
    return { error: 'Invalid name' };
  }

  try {
    const category = await prisma.category.create({
      data: {
        name,
        image: image || '',
      },
    });
    return category;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const update = async ({
  id,
  name,
  image,
}: {
  id?: string;
  name: string;
  image?: string;
}) => {
  if (id) {
    const isValidId = z.string().uuid().safeParse(id).success;
    const isValidName = z.string().min(1).safeParse(name).success;

    if (!isValidId || !isValidName) {
      return { error: 'Invalid id or name' };
    }

    try {
      const category = await prisma.category.update({
        where: {
          id,
        },
        data: {
          name,
          image,
        },
      });
      return category;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  try {
    const category = await prisma.category.updateMany({
      where: {
        name,
      },
      data: {
        image: image || '',
      },
    });
    return category;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const remove = async (id: string) => {
  const isValidId = z.string().uuid().safeParse(id).success;

  if (!isValidId) {
    return { error: 'Invalid id' };
  }

  try {
    const category = await getById(id);
    if (!category) {
      return { error: 'Category not found' };
    }
    await prisma.category.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

