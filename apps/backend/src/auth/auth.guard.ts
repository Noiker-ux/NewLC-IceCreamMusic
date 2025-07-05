import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SessionService } from './session.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly sessionServie: SessionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.headers.authorization;

    if (!token) return false;

    const { session, user } = await this.sessionServie.validateSession(token);

    if (!session) return false;

    const mustBeAdmin =
      this.reflector.getAllAndOverride<boolean>('isAdmin', [
        context.getHandler(),
        context.getClass(),
      ]) ?? false;

    if (mustBeAdmin) return user.isAdmin;

    return true;
  }
}
