import { request } from 'umi';
import type {  DictListItem,AddItem,AddItemDetail,deleteListItem, IdItem } from './data';
import {url} from '@/utils/request'

/** 获取库列表 GET /library/list */
export async function dictList() {
  return request(`${url}/dict/list`, {
    method: 'GET',
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

// /** 克隆库 GET library/remove  */
// export async function cloneList(params: { id: any; newLibName: string; includeDecoy?: boolean }) {
//   return request('/api/library/clone', {
//     method: 'GET',
//     params: {
//       ...params,
//     },
//   });
// }

// /** 删除库 GET library/remove  */
// export async function removeList(params: { libraryIds: any }) {
//   return request('/api/library/remove', {
//     method: 'GET',
//     params: {
//       ...params,
//     },
//   });
// }
