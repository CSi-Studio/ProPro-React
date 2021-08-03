export type TableListItem = {
  key: number;
  id: string;
  name: string;
  type: string;
  decoyGenerator: string;
  proteinsCount: number;
  peptidesCount: number;
  ppRate: string;
  creator: string;
  description: string;
  totalSize: number;
  createDate: number;
};

export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
};
