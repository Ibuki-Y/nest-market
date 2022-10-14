import { SetMetadata } from '@nestjs/common';
import { UserStatus } from '@prisma/client';

export const ROLES_KEY = 'statuses';
export const Role = (...statuses: UserStatus[]) =>
  SetMetadata(ROLES_KEY, statuses);
