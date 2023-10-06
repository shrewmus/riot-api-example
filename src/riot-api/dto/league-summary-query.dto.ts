import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { RegionDto } from './region.dto';
import { Type } from 'class-transformer';

export class LeagueSummaryQueryDto extends RegionDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  queue?: number = 0;
}
