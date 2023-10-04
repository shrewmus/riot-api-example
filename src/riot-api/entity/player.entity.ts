import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Leaderboard } from './leaderboard.entity';

@Entity()
export class Player {
  @PrimaryGeneratedColumn('uuid')
  uid: string;
  @Column()
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
  @CreateDateColumn({ type: 'timestamp', default: () => 'NOW()' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp', default: () => 'NOW()' })
  updatedAt: Date;
}
