import { request } from 'umi';
import type { Pagination } from '@/components/Commons/common';
import { url } from '@/utils/request';

/** 获取方法列表 GET /task/list */
export async function list(params: Pagination) {
  return request(`${url}/task/list`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

/** 查看方法详情 GET /task/detail */
export async function detail(params: any) {
  return request(`${url}/task/detail`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

/** 删除库 GET library/remove  */
export async function removeList(params: { taskIds: any }) {
  return request(`${url}/task/remove`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}
