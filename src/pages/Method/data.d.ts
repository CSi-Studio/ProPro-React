export type TableListItem = {
  id: string;
  name: string;
  mzWindow: number;
  rtWindow: number;
  adaptiveMzWindow: boolean;
  minMzWindow: number;
  minShapeScore: number;
  minShapeWeightScore: number;
  classifier: string;
  fdr: number;
  description: string;
};

export type TableListPagination = {
  pageSize: number;
  totalNum: number;
  totalPage: number;
  currentPageNo: number;
};
