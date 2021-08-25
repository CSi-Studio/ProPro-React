import { request } from 'umi';
import { url } from '@/utils/request';

/** 获取itr数据 GET /experiment/getIrts */
export async function irtList(expList: []) {
  return request(`${url}/experiment/getIrts`, {
    method: 'GET',
    params: {
      expList,
    },
  });
}