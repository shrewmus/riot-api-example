import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { NameRegionDto } from './name-region.dto';

export class LeagueSummaryQueryDto extends NameRegionDto {
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  queue?: number = 0;
}
