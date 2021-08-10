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
export async function updateList(body: {
  name?: any;
  type?: any;
  filePath?: any;
  description?: any;
}) {
  const fileData = new FormData();
  fileData.append('name', body.name);
  fileData.append('type', body.type);
  fileData.append('libFile', body.filePath[0].originFileObj);
  fileData.append('description', body.description);
  return request<TableListItem>('/api/peptide/update', {
    method: 'POST',
    header: {
      Accept: 'application/json',
    },
    data: fileData,
  });
}

/** 删除肽段库 GET /api/peptide/remove  */
export async function removeList(params: { libraryIds: any }) {
  return request('/api/peptide/remove', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}
