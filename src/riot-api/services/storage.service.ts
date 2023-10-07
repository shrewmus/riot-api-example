import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match, Player } from '../entity';
import { In, Repository } from 'typeorm';
import { NameRegionDto } from '../dto/name-region.dto';
import { PlayerDto } from '../dto/player.dto';
import { getIntEnumKeys, getIntEnumVals, Queues } from '../classes/interfaces';
import { PlayerSummary } from '../entity/player-summary.entity';

@Injectable()
export class StorageService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepo: Repository<Player>,
    @InjectRepository(Match)
    private readonly matchRepo: Repository<Match>,
    @InjectRepository(PlayerSummary)
    private readonly summaryRepo: Repository<PlayerSummary>,
  ) {}

  async getPlayerByName(nameDto: NameRegionDto) {
    return this.playerRepo.findOne({ where: { name: nameDto.name } });
  }

  async savePlayer(player: PlayerDto, region: string) {
    const newPlayer = this.playerRepo.create({ ...player, region });
    await this.playerRepo.save(newPlayer);
  }

  async getMatchesByIds(matchIds: string[]) {
    const result = { existedMatches: [], missedIds: [] };
    const existedMatches = await this.matchRepo.find({
      where: {
        matchId: In(matchIds),
      },
    });
    if (existedMatches.length) {
      result.existedMatches = existedMatches;
      const existedIds = existedMatches.map((match) => match.matchId);
      result.missedIds = matchIds.filter((id) => !existedIds.includes(id));
    } else {
      result.missedIds = matchIds;
    }
    return result;
  }

  async saveMatches(matches: any[], puuid: string) {
    const matchesToSave = [];
    for (let i = 0; i < matches.length; i++) {
      // note: [SHR]: it would be nice to create custom class transformer here
      const matchObject = { ...matches[i].metadata, ...matches[i].info };
      // I've found that index of puuid in metadata the same as the same participant data in info
      // But it may lead to inconsistency in the future, possible will change it
      const currentPlayerIdx = matches[i].metadata.participants.indexOf(puuid);
      matchObject.playerData = matches[i].info.participants[currentPlayerIdx];
      matchesToSave.push(this.matchRepo.create(matchObject));
    }
    let res: any = [];
    if (matchesToSave.length) {
      res = await this.matchRepo.save(matchesToSave);
    }
    return res;
  }

  async saveSummary(statApiData: any[]) {
    const queueVals = getIntEnumVals(Queues);
    const queueKeys = getIntEnumKeys(Queues);

    statApiData = statApiData.map((statDataItem) => {
      const queueIdx = queueKeys.indexOf(statDataItem.queueType);
      statDataItem.queue = queueVals[queueIdx];
      return statDataItem;
    });
    await this.summaryRepo
      .createQueryBuilder('summary')
      .insert()
      .into(PlayerSummary)
      .values(statApiData)
      .orUpdate(
        [
          'rank',
          'leaguePoints',
          'wins',
          'losses',
          'veteran',
          'inactive',
          'freshBlood',
          'hotStreak',
        ],
        ['leagueId', 'queue', 'tier', 'summonerId'],
      )
      .execute();
  }

  async getSummary(id: string, queue: Queues = Queues.ALL) {
    const queryBuilder = this.summaryRepo.createQueryBuilder('summary');
    try {
      let query = queryBuilder
        .select()
        .where('summary.summonerId = :id', { id });
      if (queue !== Queues.ALL) {
        query = query.andWhere('summary.queue = :queue', { queue });
      }
      return await query.execute();
    } catch (e) {
      console.log('[ERR] ', e);
      throw new InternalServerErrorException('db error');
    }
    // if (queue !== Queues.ALL) {
    // }
  }

  async getPlayerLeads(playerId: string) {
    // Use Raw SQL just to show how to do it
    const query = `
        WITH 
        RankedRates AS (
            SELECT 
                uid,
                "summonerId",
                ROW_NUMBER() OVER (ORDER BY ps.wins::float / (ps.wins + ps.losses) ASC) as "winRate"
            FROM player_summary as ps
        ),
        
        RankedLPoints AS (
            SELECT
                uid,
                "summonerId",
                ROW_NUMBER() OVER (ORDER BY ps."leaguePoints" ASC) as "leaguePoints"
            FROM player_summary as ps
        )
        
        SELECT
            r1."summonerId",
            r1."winRate",
            r2."leaguePoints"
        FROM RankedRates r1
        JOIN RankedLPoints r2 ON r1."summonerId" = r2."summonerId"
        WHERE r1."summonerId" = $1
    `;
    const lead = await this.summaryRepo.query(query, [playerId]);
    const res = { leaguePoints: { top: null }, winRate: { top: null } };
    if (lead && lead.length) {
      res.leaguePoints.top = lead[0].leaguePoints;
      res.winRate.top = lead[0].winRate;
    }
    return res;
  }
}
