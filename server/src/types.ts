import { Request, Response } from "express";
import "express-session";
import { Redis } from "ioredis";

export type MyContext = {
  req: Request;
  res: Response;
  redis: Redis;
};

// Using declaration merging (module augmentation) to be able to write own data to SessionData
declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}
