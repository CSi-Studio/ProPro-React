import { request } from 'umi';
import type { TableListItem } from './data';

/** 获取肽段列表 GET /peptide/list */
export async function peptideList(params: {
  // query
  /** 当前的页码 */
  current?: number;
  /** 页面的容量 */
  pageSize?: number;
  /** 选择的标准库ID */
  libraryId?: string;
}) {
  return request('/api/peptide/list', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

/** 更新肽段 POST /api/peptide/update */
export async function updateList(params: {
  isUnique?: boolean;
  mz?: number;
  protein?: string;
  rt?: number;
  id: string;
}) {
  // eslint-disable-next-line no-console
  return request('/api/peptide/update', {
    method: 'POST',
    params: {
      ...params,
    },
  });
}

/** 删除肽段库 GET /api/peptide/remove  */
export async function removeList(params: { peptideId: any }) {
  return request('/api/peptide/remove', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}
