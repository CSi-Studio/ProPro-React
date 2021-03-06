export type TableListItem = {
  id: string;
  runId: string;
  level: number;
  startPtr: number;
  endPtr: number;
  range: any;
};

export type TableListDetail = {
  id: string;
  runId: string;
  level: number;
  startPtr: number;
  endPtr: number;
  range: any[];
  nums: any[];
  rts: any[];
  mzs: any[];
  ints: any[];
};

export type updateListItem = {
  key: string;
  value: string;
  id: string;
};
export type deleteListItem = {
  key: string;
  id: string;
};

export type arrayItem = {
  array: any[];
};

export type IdItem = {
  id: string;
};
export type DictListItem = {
  key: string;
  value: string;
};

export type DictList = {
  id?: string;
  name: string;
};

export type TableListPagination = {
  pageSize: number;
  totalNum: number;
  totalPage: number;
  currentPageNo: number;
};

export type AddItem = {
  name: string;
};

export type AddItemDetail = {
  id: string;
  key: string;
  vaule: string;
};
