/*
https://docs.nestjs.com/middleware#middleware
*/

import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) { }
  use(req: Request, res: Response, next: Function) {
    try {
      this.jwtService.verify(req.headers.authorization);
    } catch(error) {
      throw new ForbiddenException();
    }
    next();
  }
}
