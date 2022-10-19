import { NextFunction, Request, Response } from 'express';

// create middleware
const middleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<unknown> => {
  // This middleware is used to help the user fetch the data from the database and send it to the client

  // get the user id from the request
  const userId = req.params.userId;
  // database url

  //  Lol Idk. I think we need to think of a structure on how the user will be able to use this middleware and what to parse in so we can help them fetch the data from the database and send it to the client
};

export default middleware;
