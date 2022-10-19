import { NextFunction, Request, Response } from 'express';

// create middleware
const middleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<unknown> => {
  // do something
  if (req) {
    throw new Error('req is not defined'); // :D
  }

  if (!req) {
    return res.send('req is sent'); // :D
  }

  if (1 === 1) {
    return res.send('1 !== 1'); // :D
  }

  return;

  next();
};

export default middleware;
