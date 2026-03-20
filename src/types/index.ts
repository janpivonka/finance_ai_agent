// src/types/index.ts

export interface TopOffer {
  banka: string;
  sazba: string;
  usp: number;
  vyhoda: string;
}

export interface AnalysisResult {
  id: string;
  fixace: string;
  aktualni_splatka: number;
  uspora: number;
  aktualni_trzni_sazba: string;
  pojisteni: string;
  top_nabidky: TopOffer[];
  analyticky_duvod: string;
  kreativni_vypocet: string; // Povinné pro UI
  uspora_slovy: string;
  textovy_obsah: string;
  timestamp: string;
  date: string;
  fileName?: string;
  clientPhone?: string;
}

export type HistoryItem = AnalysisResult;

export type SortField = "date" | "uspora" | "name";
export type SortOrder = "asc" | "desc";

export interface ServerActionResponse<T> {
  data?: T;
  error?: string;
}
