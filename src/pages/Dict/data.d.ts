import { List } from "echarts";

export type TableListItem = {
  id: string;
  name: string;
  item: any;
 
};

export type DictListItem = {
  key: string,
  value: string;
};

export type TableListPagination = {
  pageSize: number;
  totalNum: number;
  totalPage: number;
  currentPageNo: number;
};
