import { request } from 'umi';

/** 获取实验列表 GET /experiment/list */
export async function experimentList(params: {
  // query
  /** 当前的页码 */
  current?: number;
  /** 页面的容量 */
  pageSize?: number;
}) {
  return request('/api/experiment/list', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}
