import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PlayerApiService } from '../services/player-api.service';
import { ApiTags } from '@nestjs/swagger';
import { NameRegionDto } from '../dto/name-region.dto';
import { MatchPageQueryDto } from '../dto/match-page-query.dto';

@ApiTags('common data')
@Controller({
  path: 'data',
  version: '1',
})
export class RiotApiController {
  constructor(private playerService: PlayerApiService) {}

  @Get('summoner')
  async getPlayerInfo(@Query() summoner: NameRegionDto) {
    return await this.playerService.getPlayerInfo(summoner);
  }

  @Get('match-list')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getMatchList(@Query() matchPage: MatchPageQueryDto) {
    return await this.playerService.getMatchList(matchPage);
  }
}
