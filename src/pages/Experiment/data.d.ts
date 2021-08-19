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
