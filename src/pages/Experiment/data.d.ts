export type TableListItem = {
  id: string;
  name: string;
  alias: string;
  type: string;
  airdSize: number;
  airdIndexSize: number;
  vendorFileSize: number;
};

export type TableListPagination = {
  pageSize: number;
  totalNum: number;
  totalPage: number;
  currentPageNo: number;
};
