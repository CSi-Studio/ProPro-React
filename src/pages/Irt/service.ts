import { request } from 'umi';
import { url } from '@/utils/request';

/** 获取itr数据 GET /run/getIrts */
export async function irtList(runList: []) {
  return request(`${url}/run/getIrts`, {
    method: 'GET',
    params: {
      runList,
    },
  });
}