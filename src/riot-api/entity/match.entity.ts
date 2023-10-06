import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Match {
  @PrimaryColumn()
  matchId: string;
  @Column({ nullable: true })
  dataVersion: string;
  @Column({
    type: 'text',
    array: true,
  })
  participants: string[];
  @Column({ type: 'bigint' })
  gameId: number;
  @Column()
  queueId: number;
  @Column()
  platformId: string;
  @Column({ type: 'bigint' })
  gameCreation: number;
  @Column({ type: 'bigint' })
  gameDuration: number;
  @Column({ type: 'bigint' })
  gameEndTimestamp: number;
  @Column()
  gameMode: string;
  @Column()
  gameName: string;
  @Column({ type: 'bigint' })
  gameStartTimestamp: number;
  @Column()
  gameType: string;
  @Column()
  gameVersion: string;
  @Column()
  mapId: number;
  @Column({ type: 'jsonb' })
  teams: any;
  @Column({ type: 'jsonb' })
  playerData: any;
  @Column()
  tournamentCode: string;
  @CreateDateColumn({ type: 'timestamp', default: () => 'NOW()' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp', default: () => 'NOW()' })
  updatedAt: Date;
}
