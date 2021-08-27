import { request } from 'umi';
import type {  DictListItem,AddItem,AddItemDetail,deleteListItem, IdItem } from './data';
import {url} from '@/utils/request'

/** 获取字典信息 GET /dict/list */
export async function dictList(params: {
  // query
  /** 当前的页码 */
  current?: number;
  /** 页面的容量 */
  pageSize?: number;
  /** 选择的标准库ID */
}) {
  return request(`${url}/dict/list`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

/** 添加字典 POST /dict/add */
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

/** 更新库 POST /api/dict/update */
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

export async function getDict() {
  return request(`${url}/dict/getAll`, {
    method: 'GET',
  });
}
