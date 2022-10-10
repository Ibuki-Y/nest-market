import { ItemStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, MaxLength, IsInt, Min } from 'class-validator';

export class UpdateItemDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  name: string;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  price: number;

  @IsNotEmpty()
  status: ItemStatus;

  @IsString()
  @IsNotEmpty()
  description?: string;
}
