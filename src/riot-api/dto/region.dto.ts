import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Regions } from '../classes/interfaces';

export class RegionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(Regions)
  region: Regions;
}
