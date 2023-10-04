import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PlayerDto {
  @ApiProperty()
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  accountId: string;
  @ApiProperty()
  puuid: string;
  @ApiPropertyOptional()
  name: string;
  @ApiProperty()
  @ApiPropertyOptional()
  profileIconId: number;
  @ApiProperty()
  revisionDate: number;
  @ApiProperty()
  summonerLevel: number;
}
