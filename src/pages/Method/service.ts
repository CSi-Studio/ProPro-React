import { request } from 'umi';
import type { Pagination } from '@/components/Commons/page';
import {url} from '@/utils/request'

/** 获取方法列表 GET /method/list */
export async function list(params: Pagination) {
  return request(`${url}/method/list`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

/** 查看方法详情 GET /method/detail */
export async function detail(params: any) {
  return request(`${url}/method/detail`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

/** 添加方法 POST /method/add */
export async function add(params: any) {
  return request(`${url}/method/add`, {
    method: 'POST',
    params: {
      ...params,
    },
  });
}
/** 更新方法 POST /method/update */
export async function update(params: any) {
  return request(`${url}/method/update`, {
    method: 'POST',
    params: {
      ...params,
    },
  });
}
