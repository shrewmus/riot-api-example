import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PlayerDto } from '../dto/player.dto';
import { lastValueFrom } from 'rxjs';
import { Queues, Regions, Routings } from '../classes/interfaces';

@Injectable()
export class RiotApiAdapterService {
  private _currentRegion: string;
  set currentRegion(value: string) {
    this._currentRegion = value;
  }

  private static readonly regionsMap = {
    [Regions.NA1]: Routings.AMERICAS,
  };

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
    return RiotApiAdapterService.regionsMap[this._currentRegion].toLowerCase();
  }

  urlBase(region: string): string {
    return `https://${region}.api.riotgames.com/lol`;
  }

  async getMatchesByPuuid(
    puuid: string,
    start = 0,
    count = 20,
    queue: Queues = Queues.ALL,
  ) {
    if (count > 100) {
      count = 100;
    }
    const queryParams = {
      start: start.toString(),
      count: count.toString(),
    };
    if (queue !== Queues.ALL) {
      queryParams['queue'] = queue;
    }
    const url = `${this.urlBase(
      this.route,
    )}/match/v5/matches/by-puuid/${puuid}/ids`;
    return this.fetchFromApi<string[]>(url, queryParams);
  }

  async getSummonerByName(
    summonerName: string,
    region: string,
  ): Promise<PlayerDto> {
    this._currentRegion = region;
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

  async getMatchesByIds(missedIds: any[], storeMethod = null) {
    // note: [SHR]: trying to not exceed dev apiKey rate limits
    // to make this work for several requests, one needs to use a common queue
    const limitVal = 10; // actually limit is 20, but we make some request before
    const delay = (ms) => {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    };
    const baseUrl = this.urlBase(this.route);
    const apiMatchResults = [];
    try {
      for (let i = 0; i < missedIds.length; i += limitVal) {
        const urls = missedIds
          .slice(i, i + limitVal)
          .map((id) => `${baseUrl}/match/v5/matches/${id}`);
        const tasks = urls.map((url) => this.fetchFromApi<any>(url));
        const apiResults = await Promise.all(tasks);
        if (storeMethod) {
          apiMatchResults.push(await storeMethod(apiResults));
        } else {
          apiMatchResults.push(apiResults);
        }
        if (i + limitVal < missedIds.length) {
          await delay(1000);
        }
      }
      return apiMatchResults;
    } catch (e) {
      console.log('[ERR] ', e);
      return [];
    }
  }

  async getLeagueStatBySummoner(id: string) {
    const url = `${this.urlBase(
      this._currentRegion,
    )}/league/v4/entries/by-summoner/${id}`;
    return this.fetchFromApi<any>(url);
  }
}
