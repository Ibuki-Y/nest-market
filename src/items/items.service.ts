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
  private items: Item[] = [];

  findAll(): Promise<Item[]> {
    return this.prisma.item.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findById(id: string): Promise<Item> {
    return this.prisma.item.findFirst({
      where: {
        id,
      },
    });
  }

  async create(createItemDto: CreateItemDto): Promise<Item> {
    const item = await this.prisma.item.create({
      data: {
        id: uuid(),
        ...createItemDto,
        status: ItemStatus.ON_SALE,
      },
    });

    return item;
  }

  async update(id: string, updateItemDto: UpdateItemDto): Promise<Item> {
    // const item = this.findById(id);
    // item.status = ItemStatus.SOLD_OUT;
    // return item;
    const item = await this.prisma.item.findUnique({
      where: {
        id,
      },
    });
    if (!item) {
      throw new ForbiddenException('No permision to update');
    }

    return this.prisma.item.update({
      where: {
        id,
      },
      data: {
        ...updateItemDto,
      },
    });
  }

  async delete(id: string): Promise<void> {
    const item = await this.prisma.item.findUnique({
      where: {
        id,
      },
    });
    if (!item) {
      throw new ForbiddenException('No permision to delete');
    }

    await this.prisma.item.delete({
      where: {
        id,
      },
    });
  }
}
