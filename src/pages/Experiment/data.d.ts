export type TableListItem = {
  id: string;
  projectName: string;
  name: string;
  type: string;
  airdSize: number;
  airdIndexSize: number;
  vendorFileSize: number;
  irt: any;
  group: string;
  tags: any[];
  alias?: string;
  createDate: string;
  windowRanges: any[];
};

export type TableListPagination = {
  pageSize: number;
  totalNum: number;
  totalPage: number;
  currentPageNo: number;
};

export type PrepareAnalyzeVO = {
  insLibList: any[];
  anaLibList: any[];
  methodList: any[];
  insLibId: string;
  anaLibId: string;
  methodId: string;
  projectName: string;
};

export type AnalyzeParams = {
  projectId: string;
  expIdList: string[];
  methodId: string;
  anaLibId: string;
  insLibId: string;
};

export type AliasParams = {
  expIds: any[];
  prefix: string;
};
