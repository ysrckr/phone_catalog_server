import type { NextFunction, Request, Response } from 'express';

type HandlerFunction = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;
export const asyncHandler =
  (fn: HandlerFunction) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
