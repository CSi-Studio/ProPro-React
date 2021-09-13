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

export type PeptideTableItem = {
  key:string;
  isUnique: boolean;
  peptide: string;
  key: string;
};
