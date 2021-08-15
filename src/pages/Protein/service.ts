import { request } from 'umi';

/** 获取肽段列表 GET /peptide/list */
export async function proteinList(params: {
  // query
  /** 当前的页码 */
  current?: number;
  /** 页面的容量 */
  pageSize?: number;
  /** 选择的标准库ID */
}) {
  return request('/api/protein/list', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}
