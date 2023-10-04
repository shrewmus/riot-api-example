import { Injectable } from '@nestjs/common';
import { RiotApiAdapterService } from './riot-api-adapter.service';
import { MatchPageQueryDto } from '../dto/match-page-query.dto';
import { StorageService } from './storage.service';
import { plainToClass } from 'class-transformer';
import { PlayerDto } from '../dto/player.dto';
import { NameRegionDto } from '../dto/name-region.dto';

@Injectable()
export class PlayerApiService {
  constructor(
    private riotApi: RiotApiAdapterService,
    private storageService: StorageService,
  ) {}

  async getPlayerInfo(nameRegion: NameRegionDto) {
    let player: PlayerDto =
      await this.storageService.getPlayerByName(nameRegion);
    if (player) {
      return plainToClass(PlayerDto, player);
    }
    player = await this.riotApi.getSummonerByName(
      nameRegion.name,
      nameRegion.region,
    );
    await this.storageService.savePlayer(player, nameRegion.region);
    return player;
  }

  async getMatchList(matchPage: MatchPageQueryDto) {
    const player = await this.getPlayerInfo(matchPage);
    const matchIds = await this.riotApi.getMatchesByPuuid(
      player.puuid,
      (matchPage.page - 1) * matchPage.perPage,
      matchPage.perPage,
    );
    // todo: [SHR]: place here compare with saved matches
    return matchIds;
  }
}
