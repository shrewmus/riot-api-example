import { NameRegionDto } from './name-region.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class MatchPageQueryDto extends NameRegionDto {
  @ApiPropertyOptional()
  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number = 1;
  @IsNumber()
  @Max(100)
  @IsOptional()
  perPage?: number = 20;
}
