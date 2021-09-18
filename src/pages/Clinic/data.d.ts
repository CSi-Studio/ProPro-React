import type { IdName, IdNameAlias } from '@/components/Commons/common';

export type PrepareData = {
  project: any;
  insLib: IdName;
  anaLib: IdName;
  method: any;
  proteins: string[];
  expList: array<IdNameAlias>;
  overviewMap: Map<string, Overview>; // key为expId
};

export type Overview = {
 id: string;
  name: string;
  expId: string;
  defaultOne: boolean;
  weights: Map<string, number>;
  minTotalScore: number;
};

export type Peptide = {
  peptideRef: string;
  isUnique: boolean;
  mz: number;
};

export type PeptideTableItem = {
  mz: number;
  key: string;
  isUnique: boolean;
  peptide: string;
  key: string;
};
