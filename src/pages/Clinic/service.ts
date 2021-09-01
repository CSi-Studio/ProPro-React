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

/** 准备做蛋白诊断的相关数据 GET /clinic/prepare */
export async function getPeptideRefs(params: {libraryId: string, protein: string}) {
  return request(`${url}/peptide/getPeptideRefs`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

/** 删除库 GET library/remove  */
export async function removeList(params: { idList: any }) {
  return request(`${url}/task/remove`, {
    method: 'POST',
    params: {
      ...params,
    },
  });
}
