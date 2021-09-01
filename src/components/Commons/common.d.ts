export type Pagination = {
  pageSize: number;
  totalNum: number;
  total: number;
  current: number;
}

export type Task = {
  id: string;
  name: string;
}

export type IdName = {
  id: string
  name: string
}

export type IdNameAlias = {
  id: string
  name: string
  alias: string
}
