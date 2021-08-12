export type TableListItem = {
  id: string;
  name: string;
  filePath: string;
  type: string;
  description: string;
  generator: string;
  statistic: Record<string, any>;
  organism: string[];
  createDate: number | string;
  lastModifiedDate?: number | string;
};

export type TableListPagination = {
  pageSize: number;
  totalNum: number;
  totalPage: number;
  currentPageNo: number;
};
