import { NextFunction, Request, Response } from 'express';

// create middleware
const middleware = (req: Request, res: Response, next: NextFunction) => {
  // do something
  next();
};

// export middleware as xss
export default middleware;
