import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match, Player, PlayerSummary } from "./entity";
import { PlayerApiService } from './services/player-api.service';
import { RiotApiAdapterService } from './services/riot-api-adapter.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { RiotApiController } from './controllers/riot-api.controller';
import { StorageService } from './services/storage.service';

const entites = [Player, Match, PlayerSummary];

@Module({
  controllers: [RiotApiController],
  providers: [PlayerApiService, RiotApiAdapterService, StorageService],
  imports: [ConfigModule, HttpModule, TypeOrmModule.forFeature([...entites])],
})
export class RiotApiModule {}
