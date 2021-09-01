import { request } from 'umi';
import type { Pagination } from '@/components/Commons/common';
import { url } from '@/utils/request';

/** 准备做蛋白诊断的相关数据 GET /clinic/prepare */
export async function prepare(params: any) {
  return request(`${url}/clinic/prepare`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

/** 根据蛋白获取对应库下的所有相关肽段 */
export async function getPeptideRefs(params: {libraryId: string, protein: string}) {
  return request(`${url}/peptide/getPeptideRefs`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

/** 根据肽段信息直接获取某实验下的EIC图像 GET data/getExpData  */
export async function getExpData(params: any) {
  return request(`${url}/data/getExpData`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}
