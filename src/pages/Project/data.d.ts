export type TableListItem = {
  id: string;
  name: string;
  alias: string;
  type: string;
  owner: string;
  expCount: number;
  overviewCount: number;
  insLibId: string;
  anaLibId: string;
  methodId: string;
  insLibName: string;
  anaLibName: string;
  methodName: string;
  tags: string[];
  group: string;
  description: string;
  createDate: string;
  lastModifiedDate: string;
};

export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
};
