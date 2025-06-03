import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { ContextOptions, TRPCContext } from 'nestjs-trpc';

export type TTrpcContext = {
  req: Request;
  res: Response;
};

@Injectable()
export class TrpcContext implements TRPCContext {
  create(opt: ContextOptions) {
    return {
      req: opt.req,
      res: opt.res,
    };
  }
}
