import type { Request, Response } from 'express';
import {
  checkCache,
  create as createUser,
  deleteCache,
  getAll as getAllUsers,
  getByEmail as getUserByEmail,
  getById as getUserById,
  remove as removeUser,
  setCachedRole,
} from '../services/users';
import { User, userSchema } from '../types/User';
import { comparePassword, hashPassword } from '../utils/passwordHash';

// Get all users
export const getAll = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

// Register a user
export const register = async (req: Request, res: Response) => {
  if (!userSchema.safeParse(req.body.body).success) {
    return res.status(400).json({ error: 'Invalid user' });
  }

  const { name, email, password, role } = req.body.body;

  const hashedPassword = hashPassword(password);
  const user: User = {
    name,
    email,
    password: hashedPassword,
    role: role || undefined,
  };

  try {
    const { name, email, id, role } = await createUser(user);

    if (!name || !email) {
      return res.status(400).json({ error: 'invalid name or email' });
    }

    await setCachedRole(id, role);

    return res.status(201).json({ name, email, id });
  } catch (error) {
    console.error(error);
    return res.status(409).json({ error: 'Email already exists' });
  }
};

// Register a user without a role
export const registerWithOutRole = async (req: Request, res: Response) => {
  if (!userSchema.safeParse(req.body).success) {
    return res.status(400).json({ error: 'Invalid user' });
  }

  const { name, email, password } = req.body;

  const hashedPassword = hashPassword(password);

  const user: Omit<User, 'role'> = {
    name,
    email,
    password: hashedPassword,
  };

  try {
    const { name, email, id } = await createUser(user);

    if (!name || !email) {
      return res.status(400).json({ error: 'invalid name or email' });
    }

    return res.status(201).json({ name, email, id });
  } catch (error) {
    return res.status(409).json({ error: 'Email already exists' });
  }
};

// Login a user
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const { id, role, name } = user;

    await setCachedRole(id, role);

    return res.status(200).json({ name, email, id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};

// Logout a user
export const logout = async (req: Request, res: Response) => {
  const id = req.headers.authorization;

  if (!id) {
    return res.status(400).json({ error: 'Invalid user' });
  }

  try {
    await deleteCache(id);

    return res.status(200).json({ message: 'Logged out' });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

// Remove a user
export const remove = async (req: Request, res: Response) => {
  const { email } = req.body;
  const id = req.headers.authorization;

  if (!id) {
    return res.status(401).json({ error: 'Not Authorize' });
  }
  try {
    const authUser = await getUserById(id);

    if (!authUser) {
      return res.status(401).json({ error: 'Not Authorize' });
    }

    if (authUser.email === email) {
      return res.status(400).json({ error: 'Cannot delete yourself' });
    }

    const deleteUser = await getUserByEmail(email);

    if (!deleteUser) {
      return res.status(400).json({ error: 'Invalid user' });
    }

    const role = await checkCache(deleteUser.id);

    if (role) {
      await deleteCache(deleteUser.id);
    }

    await removeUser(email);

    return res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

// Check if user is logged in
export const check = async (req: Request, res: Response) => {
  const id = req.headers.authorization;
  try {
    if (!id) {
      return res.status(401).json(false);
    }

    const role = await checkCache(id);

    if (!role || role !== 'ADMIN') {
      return res.status(401).json(false);
    }

    return res.status(200).json(true);
  } catch (error) {
    return res.status(500).json({ error });
  }
};
