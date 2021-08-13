import { request } from 'umi';
import type { TableListItem } from './data';

/** 获取方法列表 GET /method/list */
export async function methodList(params: {
  // query
  /** 当前的页码 */
  current?: number;
  /** 页面的容量 */
  pageSize?: number;
}) {
  return request('/api/method/list', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

/** 查看方法详情 GET /method/detail */
export async function methodDetail(params: {
  // query
  /** 当前的页码 */
  current?: number;
  /** 页面的容量 */
  pageSize?: number;
}) {
  return request('/api/method/list', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

/** 添加方法 POST /api/method/add */
export async function addMethod(params: any) {
  return request('/api/method/add', {
    method: 'POST',
    params: {
      ...params,
    },
  });
}
/** 更新方法 POST /api/method/update */
export async function updateMethod(params: any) {
  return request('/api/method/update', {
    method: 'POST',
    params: {
      ...params,
    },
  });
}
