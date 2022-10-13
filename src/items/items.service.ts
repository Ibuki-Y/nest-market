import { ForbiddenException, Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Item } from '@prisma/client';
import { ItemStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) {}
  findAll(): Promise<Item[]> {
    return this.prisma.item.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findAllByUserId(userId: string): Promise<Item[]> {
    return this.prisma.item.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findById(itemId: string): Promise<Item> {
    return this.prisma.item.findFirst({
      where: {
        id: itemId,
      },
    });
  }

  findByUserId(userId: string, itemId: string): Promise<Item> {
    return this.prisma.item.findFirst({
      where: {
        userId,
        id: itemId,
      },
    });
  }

  async create(userId: string, createItemDto: CreateItemDto): Promise<Item> {
    const item = await this.prisma.item.create({
      data: {
        id: uuid(),
        ...createItemDto,
        status: ItemStatus.ON_SALE,
        userId,
      },
    });

    return item;
  }

  async update(
    userId: string,
    itemId: string,
    updateItemDto: UpdateItemDto,
  ): Promise<Item> {
    const item = await this.prisma.item.findUnique({
      where: {
        id: itemId,
      },
    });
    if (!item || item.userId !== userId) {
      throw new ForbiddenException('No permision to update');
    }

    return this.prisma.item.update({
      where: {
        id: itemId,
      },
      data: {
        ...updateItemDto,
      },
    });
  }

  async delete(userId: string, itemId: string): Promise<void> {
    const item = await this.prisma.item.findUnique({
      where: {
        id: itemId,
      },
    });
    if (!item || item.userId !== userId) {
      throw new ForbiddenException('No permision to delete');
    }

    await this.prisma.item.delete({
      where: {
        id: itemId,
      },
    });
  }
}
