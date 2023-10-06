import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Leaderboard } from './leaderboard.entity';
import { PlayerSummary } from './player-summary.entity';

@Entity()
export class Player {
  @PrimaryColumn()
  id: string;
  @Column()
  accountId: string;
  @Column()
  puuid: string;
  @Column()
  name: string;
  @Column()
  profileIconId: number;
  @Column({ type: 'bigint' })
  revisionDate: number;
  @Column({ type: 'bigint' })
  summonerLevel: number;
  @Column()
  region: string;
  @OneToOne(() => Leaderboard, (leaderBoard) => leaderBoard.player)
  leaderBoard: Leaderboard;
  @OneToMany(() => PlayerSummary, (summary) => summary.player)
  summary: PlayerSummary[];
  @CreateDateColumn({ type: 'timestamp', default: () => 'NOW()' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp', default: () => 'NOW()' })
  updatedAt: Date;
}
