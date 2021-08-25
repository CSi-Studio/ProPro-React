import { request } from 'umi';
import type { TableListItem } from './data';
import {url} from '@/utils/request'
import { updateFormValueType } from './components/UpdateForm';





/** 获取项目列表 GET /api/overview/list */
export async function overviewList(params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
    projectId?: string
  }) {
    return request(`${url}/overview/list`, {
      method: 'GET',
      params: {
        ...params,
      },
    });
  }
  

/** 获取overview详情 GET /overview/detail */
export async function overviewDetail(params: { id?: string }) {
  return request(`${url}/overview/detail`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

/** 更新项目 POST /api/project/update */
export async function updateList(params: {
  id:string,
  tags:any,
  note:string
}) {
  return request<TableListItem>(`${url}/overview/update`, {
    method: 'POST',
    params: {
      ...params,
    },
  });
}


