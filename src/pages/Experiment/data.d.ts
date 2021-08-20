export type TableListItem = {
  id: string;
  projectName: string;
  name: string;
  type: string;
  airdSize: number;
  airdIndexSize: number;
  vendorFileSize: number;
  irt: any;
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
  insLibList: Array;
  anaLibList:Array;
  methodList:Array;
  insLibId:string
  anaLibId:string
  methodId:string
  projectName:string
}

export type AnalyzeParams = {
  projectId:string;
  expIdList: Array<string>;
  methodId: string;
  anaLibId: string;
  insLibId: string;
}