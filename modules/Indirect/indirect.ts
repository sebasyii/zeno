import { NextFunction, Request, Response } from 'express';
import { RedisClientType } from '@redis/client/dist/lib/client';
import { randomUUID } from 'crypto';

interface IndirectArgs {
  redisClient: RedisClientType;
  model: string;
}

interface Indirect {
  redisClient: RedisClientType;
}

interface ZenoRequest extends Request {
  newExternalID: (model: string, internalID: string) => string;
}

const newExternalID = (redisClient: RedisClientType) => {
  return (model: string, internalID: string): string => {
    const externalID = randomUUID();
    redisClient.HSET(model, externalID, internalID.toString());

    return externalID;
  };
};

class Indirect implements Indirect {
  constructor(args: IndirectArgs) {
    this.redisClient = args.redisClient;
  }

  public middleware = (model: string) => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    return async (req: ZenoRequest, res: Response, next: NextFunction) => {
      // Exposed method to generate external ID
      req.newExternalID = newExternalID(this.redisClient);

      if (model === undefined) return next();

      // Convert external IDs to internal IDs
      for (const item of ['params', 'query', 'body']) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const [key, value] of Object.entries(req[item]) as [string, any]) {
          if (value.length === 36) {
            const internalID = await this.redisClient.HGET(model, value);

            if (internalID) {
              req[item][key] = internalID;
            }
          }
        }
      }

      next();
    };
  };
}

export default Indirect;
