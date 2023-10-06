export enum Queues {
  RANKED_SOLO_5x5 = 420,
  RANKED_FLEX_SR = 440,
  NORMAL_BLIND_PICK = 430,
  NORMAL_DRAFT_PICK = 400,
  ARAM = 450,
  ALL = 0,
}

// note: [SHR]: add more regions
export enum Regions {
  NA1 = 'NA1',
}

// note: [SHR]: add more routes
export enum Routings {
  AMERICAS = 'AMERICAS',
}

export const getIntEnumKeys = (enm) => Object.keys(enm)
  .filter(key => isNaN(Number(key)));

export const getIntEnumVals = (enm) => getIntEnumKeys(enm)
  .map(key => enm[key]);

export const getStrEnumKeys = (enm) => Object.keys(enm);
export const getStrEnumValues = (enm) => getStrEnumKeys(enm)
  .map(key => enm[key]);
