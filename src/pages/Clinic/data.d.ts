import type { IdName, IdNameAlias } from '@/components/Commons/common';

export type PrepareData = {
  project: any;
  insLib: IdName;
  anaLib: IdName;
  method: any;
  proteins: string[];
  expList: array<IdNameAlias>;
  overviewMap: Map<string, any>;
};

export type Peptide = {
  peptideRef: string;
  isUnique: boolean;
};

export type PeptideRow = {
  proteins: string;
  peptide: string;
  dataList: string[];
};
export type peptideTableItem = {
  isUnique: boolean;
  peptide: string;
};
