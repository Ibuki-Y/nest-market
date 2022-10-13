import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Item, User } from '@prisma/client';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorator/get-user.decorator';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  findAll(): Promise<Item[]> {
    return this.itemsService.findAll();
  }

  // @Get()
  // findAllByUserId(@GetUser() user: User): Promise<Item[]> {
  //   return this.itemsService.findAllByUserId(user.id);
  // }

  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string): Promise<Item> {
    return this.itemsService.findById(id);
  }

  // @Get(':id')
  // findByUserId(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @GetUser() user: User,
  // ): Promise<Item> {
  //   return this.itemsService.findByUserId(user.id, id);
  // }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createItemDto: CreateItemDto,
    @GetUser() user: User,
  ): Promise<Item> {
    return this.itemsService.create(user.id, createItemDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateItemDto: UpdateItemDto,
    @GetUser() user: User,
  ): Promise<Item> {
    return this.itemsService.update(user.id, id, updateItemDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.itemsService.delete(user.id, id);
  }
}
