export type TableListItem = {
  id: string;
  identifier: string;
  reviewed: boolean;
  name: string[];
  organism: string;
  gene: string;
  sequence: string;
  uniPortLink: string;
  alphaFoldLink: string;
};

export type TableListPagination = {
  pageSize: number;
  totalNum: number;
  totalPage: number;
  currentPageNo: number;
};
