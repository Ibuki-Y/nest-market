import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CredentialsDto } from './dto/credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);
    const user = this.prisma.user.create({
      data: {
        id: uuid(),
        ...createUserDto,
      },
    });

    return user;
  }

  async login(
    credentialsDto: CredentialsDto,
  ): Promise<{ accessToken: string }> {
    const user = await this.prisma.user.findUnique({
      where: {
        username: credentialsDto.username,
      },
    });
    if (!user) {
      throw new ForbiddenException('Username or password incorrected');
    }

    const isValid = await bcrypt.compare(
      credentialsDto.password,
      user.password,
    );
    if (!isValid) {
      throw new ForbiddenException('Username or password incorrected');
    }

    try {
      const payload = { id: user.id, username: user.username };
      const accessToken = this.jwtService.sign(payload);

      return { accessToken };
    } catch (e) {
      throw new UnauthorizedException('Check username or password');
    }
  }
}
