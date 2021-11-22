import type { IdName, IdNameAlias } from '@/components/Commons/common';

export type PrepareData = {
  project: any;
  insLib: IdName;
  anaLib: IdName;
  method: any;
  peptideCount: number;
  proteinCount: number;
  proteins: string[];
  runList: array<IdNameAlias>;
  overviewMap: Map<string, Overview>; // key为runId
};

export type Overview = {
  id: string;
  name: string;
  runId: string;
  defaultOne: boolean;
  weights: Map<string, number>;
  minTotalScore: number;
};

export type Peptide = {
  peptideRef: string;
  isUnique: boolean;
  mz: number;
  rt: number;
};

export type PeptideTableItem = {
  mz: number;
  key: string;
  isUnique: boolean;
  peptide: string;
  rt: number;
  key: string;
};

export interface RunData {
  id: string;
  runId: string;
  group?: any;
  alias?: any;
  decoy: boolean;
  overviewId: string;
  proteins: string[];
  peptideRef: string;
  peakGroupList?: any;
  selectIndex: number;
  rtArray: number[];
  intMap: Map<string, number[]>;
  cutInfoMap: Map<string, number>;
  status: number;
  fdr?: any;
  irt: number;
  apexRt?: any;
  selectedRt?: any;
  intensitySum?: any;
  ionsLow?: any;
  minTotalScore: number;
  qvalue?: any;
}

