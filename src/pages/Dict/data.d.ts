import { List } from "echarts";

export type TableListItem = {
  key:string,
  value:string,
  id:string,
  name:string,
  item:Array[],
  obj:any
};

export type updateListItem = {
  key:string,
  value:string,
  id:string,

};
export type deleteListItem = {
  key:string,
  id:string,
};
export type IdItem = {
  id:string
}
export type DictListItem = {
  key: string,
  value: string;
};

export type DictList = {
  id?:string,
  name:string,
};


export type TableListPagination = {
  pageSize: number;
  totalNum: number;
  totalPage: number;
  currentPageNo: number;
};

export type AddItem = {
  name:string
};

export type AddItemDetail = {
  id:string;
  key:string;
  vaule:string
};
