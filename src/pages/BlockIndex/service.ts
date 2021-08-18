import { request } from 'umi';
import type {  DictListItem,AddItem,AddItemDetail,deleteListItem, IdItem } from './data';
import {url} from '@/utils/request'


/** 获取BlockIndex详情 GET /blockindex/detail */
export async function blockIndexDetail(params: {
  id?: string;
}) {
  return request(`${url}/blockindex/detail`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

/** 获取BlockIndex GET /blockindex/list */
export async function blockIndexList(params: {
  // query
  /** 当前的页码 */
  current?: number;
  /** 页面的容量 */
  pageSize?: number;
  expId?: string;
}) {
  return request(`${url}/blockindex/list`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

/** 添加库 POST /api/library/add */
export async function addList(body: { name:string }) {
  const fileData = new FormData();
  fileData.append('name', body.name);
  return request<AddItem>(`${url}/dict/add`, {
    method: 'POST',
    header: {
      Accept: 'application/json',
    },
    data: fileData,
  });
}

export async function addListItem(body: { id:string;key:string;value:string }) {
  const fileData = new FormData();
  fileData.append('id', body.id);
  fileData.append('key', body.key);
  fileData.append('value', body.value);


  return request<AddItemDetail>(`${url}/dict/addItem`, {
    method: 'POST',
    header: {
      Accept: 'application/json',
    },
    data: fileData,
  });
}

/** 更新库 POST /api/library/update */
export async function updateList(body: {  id: string; key?: any; value?: any }) {
  const fileData = new FormData();
  fileData.append('id', body.id);
  fileData.append('key', body.key);
  fileData.append('value', body.value);
  return request<DictListItem>(`${url}/dict/update`, {
    method: 'POST',
    data: fileData,
  });
}

/** 刪除DictItem /api/library/update */
export async function deleteItem(body: {  id: string; key?: any}) {
  const fileData = new FormData();
  fileData.append('id', body.id);
  fileData.append('key', body.key);
  return request<deleteListItem>(`${url}/dict/removeItem`, {
    method: 'POST',
    data: fileData,
  });
}

/** 刪除DictItem /api/library/update */
export async function deleteDict(body: {  id: string;}) {
  const fileData = new FormData();
  fileData.append('id', body.id);

  return request<IdItem>(`${url}/dict/remove`, {
    method: 'POST',
    data: fileData,
  });
}

// blockIndex展示


