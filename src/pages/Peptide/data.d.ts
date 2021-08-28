export type TableListItem = {
  id: string;
  libraryId: string;
  peptideRef: string;
  mz: number;
  proteins: string[];
  isUnique: boolean;
  rt: number;
  sequence: string;
  fullName: string;
  charge: number;
  unimodMap: Record<string, string>;
  fragments: any[];
  decoySequence: string;
  decoyUnimodMap: Record<string, string>;
  decoyFragments: any[];
  features: null;
};

export type TableListPagination = {
  pageSize: number;
  totalNum: number;
  totalPage: number;
  currentPageNo: number;
};
