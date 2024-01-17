import { BadRequestException, NestMiddleware } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';

export class UserIdCheckMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!String(req.params.id).match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException('Invalid ID!');
    }
    next();
  }
}
