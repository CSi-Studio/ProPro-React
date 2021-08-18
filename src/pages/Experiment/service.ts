import { request } from 'umi';
import { url } from '@/utils/request';

/** 获取实验列表 GET /experiment/list */
export async function experimentList(params: {
  // query
  projectId?: string;
  /** 当前的页码 */
  pageNo?: number;
  /** 页面的容量 */
  pageSize?: number;
}) {
  return request(`${url}/experiment/list`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}
