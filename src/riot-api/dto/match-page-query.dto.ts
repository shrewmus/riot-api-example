import { NameRegionDto } from './name-region.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { Queues } from '../classes/interfaces';
import { Type } from "class-transformer";

export class MatchPageQueryDto extends NameRegionDto {
  @ApiPropertyOptional({
    enum: Queues,
    default: Queues.ALL,
  })
  @IsEnum(Queues)
  @Type(() => Number)
  @IsOptional()
  queue?: Queues = Queues.ALL;
  @ApiPropertyOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;
  @ApiPropertyOptional()
  @IsNumber()
  @Max(100)
  @Type(() => Number)
  @IsOptional()
  perPage?: number = 20;
}
