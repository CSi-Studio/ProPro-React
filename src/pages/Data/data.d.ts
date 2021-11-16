export type TableListItem = {
  id: string;
  peptideRef: string;
  proteins: array[];
  fdr: number;
  qValue: number;
  decoy: boolean;
  irt: number;
  apexRt: number;
  status: number;
  intensitySum: number;
};

export type TableListPagination = {
  pageSize: number;
  totalNum: number;
  totalPage: number;
  current: number;
};
