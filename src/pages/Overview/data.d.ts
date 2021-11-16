export type TableListItem = {
  id: string;
  projectId: string;
  runId: string;
  name: string;
  runName: string;
  tags: string[];
  insLibId: string;
  anaLibId: string;
  type: string;
  params: any;
  createDate: string;
  lastModifiedDate: string;
  statistic: any;
  weights: any;
  note: string;
  featureMap: any;
  minTotalScore: number;
  defaultOne: boolean;
  reselect: boolean;
};

export type TableListPagination = {
  pageSize: number;
  totalNum: number;
  totalPage: number;
  currentPageNo: number;
};
