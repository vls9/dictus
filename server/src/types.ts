import { Request, Response } from "express";
import "express-session";
import { Redis } from "ioredis";
import { ObjectType, Field } from "type-graphql";

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

@ObjectType()
export class FieldError {
  @Field()
  field!: string;

  @Field()
  message!: string;
}

@ObjectType()
export class NoFieldError {
  @Field()
  message!: string;
}
