import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Player } from './player.entity';

@Entity()
export class Leaderboard {
  @PrimaryColumn('uuid')
  id: string;

  @OneToOne(() => Player, (player) => player.leaderBoard)
  @JoinColumn()
  player: Player;

  @Column()
  summonerId: string;

  @Column()
  region: string;

  winRate: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'NOW()' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp', default: () => 'NOW()' })
  updatedAt: Date;
}
