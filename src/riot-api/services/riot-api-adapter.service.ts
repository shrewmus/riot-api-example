import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PlayerDto } from '../dto/player.dto';
import { lastValueFrom } from 'rxjs';

enum Regions {
  NA1 = 'NA1',
}

enum Routings {
  AMERICAS = 'AMERICAS',
}

@Injectable()
export class RiotApiAdapterService {
  private static readonly regionsMap = {
    [Regions.NA1]: Routings.AMERICAS,
  };

  private currentRegion: string;

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    httpService.axiosRef.interceptors.request.use((requestConfig) => {
      requestConfig.headers['X-Riot-Token'] = this.apiKey;
      return requestConfig;
    });
  }

  get apiKey(): string {
    return this.configService.get<string>('RIOT_API');
  }

  get route(): string {
    // note: here need to check and handle if currentRegion and mapping exists or not
    return RiotApiAdapterService.regionsMap[this.currentRegion].toLowerCase();
  }

  urlBase(region: string): string {
    return `https://${region}.api.riotgames.com/lol`;
  }

  async getMatchesByPuuid(puuid: string, start = 0, count = 20) {
    if (count > 100) {
      count = 100;
    }

    const url = `${this.urlBase(
      this.route,
    )}/match/v5/matches/by-puuid/${puuid}/ids`;
    return this.fetchFromApi<string[]>(url, {
      start: start.toString(),
      count: count.toString(),
    });
  }

  async getMatchById(matchId: string) {
    const url = `${this.urlBase(this.route)}/match/v5/matches/${matchId}`;
    // todo: [SHR]: implement api call here
  }

  async getSummonerByName(
    summonerName: string,
    region: string,
  ): Promise<PlayerDto> {
    this.currentRegion = region;
    const url = `${this.urlBase(
      region.toLowerCase(),
    )}/summoner/v4/summoners/by-name/${summonerName}`;
    return this.fetchFromApi<PlayerDto>(url);
  }

  async fetchFromApi<T>(
    url: string,
    params: { [key: string]: string } = {},
  ): Promise<T> {
    const response = await lastValueFrom(this.httpService.get<T>(url, params));
    return response.data;
  }
}
