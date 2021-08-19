export type TableListItem = {
  id: string;
  name: string;
  alias: string;
  type: string;
  owner: string;
  insLibId: string;
  anaLibId: string;
  methodId: string;
  tags: string[];
  description: string;
  createDate: string;
  lastModifiedDate: string;
};

export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
};
