
export interface FilteredItem {
  name: string;
  station: string;
  mealPeriod: string;
  rationale: string;
}

export enum AppStatus {
  Idle,
  Loading,
  Success,
  NoResults,
  Error,
}
