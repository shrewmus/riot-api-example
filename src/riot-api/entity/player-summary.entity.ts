import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Player } from './player.entity';

@Entity()
@Unique(['leagueId', 'queue', 'tier', 'summonerId'])
export class PlayerSummary {
  @PrimaryGeneratedColumn('uuid')
  uid: string;
  @Column()
  leagueId: string;
  @Column()
  queue: number;
  @Column()
  queueType: string;
  @Column()
  tier: string;
  @Column()
  rank: string;
  @ManyToOne(() => Player, (player) => player.summary)
  @JoinColumn({ name: 'summonerId' })
  player: Player;
  @Column({ name: 'summonerId', type: 'string' })
  summonerId: string;
  @Column()
  summonerName: string;
  @Column()
  leaguePoints: number;
  @Column()
  wins: number;
  @Column()
  losses: number;
  @Column({ default: false })
  veteran: boolean;
  @Column({ default: false })
  inactive: boolean;
  @Column({ default: false })
  freshBlood: boolean;
  @Column({ default: false })
  hotStreak: boolean;
  @CreateDateColumn({ type: 'timestamp', default: () => 'NOW()' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp', default: () => 'NOW()' })
  updatedAt: Date;
}

/*

queue: Queues;
[
  {

    "summonerId": "AE9iWkzCDkxlojDJ0ycYJhTnYGn0UY532zOoZUDSigVKnz0",
    "summonerName": "DiscordKitten55",
    "leaguePoints": 75,
    "wins": 10,
    "losses": 3,
    "veteran": false,
    "inactive": false,
    "freshBlood": false,
    "hotStreak": false
  }
]*/
