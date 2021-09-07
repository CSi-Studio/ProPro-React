export type TableListItem = {
  id: string;
  peptideRef: string;
  proteins: array[];
  fdr: number;
  qValue: number;
  decoy: boolean;
  irt: number;
  realRt: number;
  status: number;
  sum: number;
};

export type TableListPagination = {
  pageSize: number;
  totalNum: number;
  totalPage: number;
  current: number;
};
