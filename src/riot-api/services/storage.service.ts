import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from '../entity';
import { Repository } from 'typeorm';
import { NameRegionDto } from '../dto/name-region.dto';
import { PlayerDto } from '../dto/player.dto';

@Injectable()
export class StorageService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepo: Repository<Player>,
  ) {}

  async getPlayerByName(nameDto: NameRegionDto) {
    return this.playerRepo.findOne({ where: { name: nameDto.name } });
  }

  async savePlayer(player: PlayerDto, region: string) {
    const newPlayer = this.playerRepo.create({ ...player, region });
    await this.playerRepo.save(newPlayer);
  }
}
