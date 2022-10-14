import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserStatus } from '@prisma/client';
import { ROLES_KEY } from '../decorator/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredStatuses = this.reflector.get<UserStatus[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (!requiredStatuses) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredStatuses.some((status) => user.status?.includes(status));
  }
}
