import { Injectable, NotFoundException } from '@nestjs/common';
import { RiotApiAdapterService } from './riot-api-adapter.service';
import { MatchPageQueryDto } from '../dto/match-page-query.dto';
import { StorageService } from './storage.service';
import { plainToClass } from 'class-transformer';
import { PlayerDto } from '../dto/player.dto';
import { NameRegionDto } from '../dto/name-region.dto';
import { LeagueSummaryQueryDto } from '../dto/league-summary-query.dto';
import { getIntEnumKeys, getIntEnumVals, Queues } from '../classes/interfaces';

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
    try {
      player = await this.riotApi.getSummonerByName(
        nameRegion.name,
        nameRegion.region,
      );
      await this.storageService.savePlayer(player, nameRegion.region);
      await this.updateLeaguesStats(player.id);
      return player;
    } catch (e) {
      console.log('[ERR]', e);
      throw new NotFoundException('player not found');
    }
  }

  async getMatchList(matchPage: MatchPageQueryDto) {
    this.riotApi.currentRegion = matchPage.region;
    const player = await this.getPlayerInfo(matchPage);
    const matchIds = await this.riotApi.getMatchesByPuuid(
      player.puuid,
      (matchPage.page - 1) * matchPage.perPage,
      matchPage.perPage,
      matchPage.queue,
    );
    const { missedIds } = await this.storageService.getMatchesByIds(matchIds);
    if (missedIds.length) {
      await this.riotApi.getMatchesByIds(
        missedIds,
        async (data) =>
          await this.storageService.saveMatches(data, player.puuid),
      );
      // since new matches - so assume that stats also outdated
      await this.updateLeaguesStats(player.id);
    }

    const queueVals = getIntEnumVals(Queues);
    const queueKeys = getIntEnumKeys(Queues);

    return {
      matchIds,
      matches: (await this.storageService.getMatchesByIds(matchIds))
        .existedMatches,
      page: matchPage.page,
      perPage: matchPage.perPage,
      queueId: matchPage.queue,
      queue: queueKeys[queueVals.indexOf(matchPage.queue)],
    };
  }

  private async updateLeaguesStats(id: string) {
    const statApiData = await this.riotApi.getLeagueStatBySummoner(id);
    await this.storageService.saveSummary(statApiData);
  }

  async getPlayerSummary(summaryQuery: LeagueSummaryQueryDto) {
    this.riotApi.currentRegion = summaryQuery.region;
    await this.updateLeaguesStats(summaryQuery.id);
    return await this.storageService.getSummary(
      summaryQuery.id,
      summaryQuery.queue,
    );
  }

  async getPlayerLeaderboard(nameRegion: NameRegionDto) {
    const player = await this.getPlayerInfo(nameRegion);
    return await this.storageService.getPlayerLeads(player.id);
  }
}
