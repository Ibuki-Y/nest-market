import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async signup(createUserDto: CreateUserDto): Promise<User> {
    const user = this.prisma.user.create({
      data: {
        id: uuid(),
        ...createUserDto,
      },
    });

    return user;
  }
}
