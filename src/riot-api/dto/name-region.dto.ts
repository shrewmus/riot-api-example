import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { RegionDto } from './region.dto';

export class NameRegionDto extends RegionDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
}
