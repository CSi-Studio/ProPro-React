import { request } from 'umi';
import { url } from '@/utils/request';

/** 获取肽段列表 GET /peptide/list */
export async function peptideList(params: {
  // query
  /** 当前的页码 */
  current?: number;
  /** 页面的容量 */
  pageSize?: number;
  /** 选择的标准库ID */
  libraryId: string;
  peptideRef?: string;
}) {
  return request(`${url}/peptide/list`, {
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
  return request(`${url}/peptide/update`, {
    method: 'POST',
    params: {
      ...params,
    },
  });
}
/** 预测肽段碎片 POST /api/peptide/predict */
export async function predictPeptide(params: {
  spModel: string;
  isotope: boolean;
  limit: number;
  peptideId: string;
}) {
  // eslint-disable-next-line no-console
  return request(`${url}/peptide/predict`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}
/** 预测肽段碎片 POST /api/peptide/predict */
export async function updateFragment(params: { peptideId?: string }, fragments: any) {
  // eslint-disable-next-line no-console
  return request(`${url}/peptide/updateFragment`, {
    method: 'POST',
    params: {
      ...params,
    },
    body: JSON.stringify(fragments),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/** 删除肽段库 GET /api/peptide/remove  */
export async function removeList(params: { peptideId: any }) {
  return request(`${url}/peptide/remove`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}
