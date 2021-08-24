import { request } from 'umi';
import { url } from '@/utils/request';

// const expList = '61234a56a6d49035211f90b4,61234a56a6d49035211f90b5';

/** 获取itr数据 GET /experiment/getIrts */
export async function irtList(expList: []) {
  return request(`${url}/experiment/getIrts`, {
    method: 'GET',
    params: {
      expList,
    },
  });
}