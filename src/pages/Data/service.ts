import { request } from 'umi';
import {url} from '@/utils/request'

/** 获取肽段列表 GET /data/list */
export async function dataList(params: {
  // query
  /** 当前的页码 */
  current?: number;
  /** 页面的容量 */
  pageSize?: number;
  overviewId?: string;
}) {
  return request(`${url}/data/list`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}