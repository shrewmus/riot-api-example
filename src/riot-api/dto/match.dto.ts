type DynamicFields = {
  [key: string]: any;
};

export class MatchMetadataDto {
  dataVersion: string;
  matchId: string;
  participants: string[];
}

class DefinedParticipantDto {
  assists: number;
  kills: number;
  win: boolean;
}

export type ParticipantDto = DefinedParticipantDto & DynamicFields;

class DefinedInfoDto {
  gameId: number;
  gameMode: string;
  gameName: string;
  gameType: string;
  gameVersion: string;
  queueId: number;
  gameStartTimestamp: number;
  gameEndTimestamp: number;
  participants: ParticipantDto[];
}

export type InfoDto = DefinedInfoDto & DynamicFields;

export class MatchDtoPartial {
  metadata: MatchMetadataDto;
  info: InfoDto;
}
