import { request } from 'umi';
import type { TableListItem } from './data';

/** 获取项目列表 GET /api/project/list */
export async function projectList(params: {
  // query
  /** 当前的页码 */
  current?: number;
  /** 页面的容量 */
  pageSize?: number;
}) {
  return request('/api/project/list', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

/** 添加项目 POST /api/project/add */
export async function addList(body: { name?: any; type?: any; filePath?: any; description?: any }) {
  const fileData = new FormData();
  fileData.append('name', body.name);
  fileData.append('type', body.type);
  fileData.append('libFile', body.filePath[0].originFileObj);
  fileData.append('description', body.description);
  return request<TableListItem>('/api/project/add', {
    method: 'POST',
    header: {
      Accept: 'application/json',
    },
    data: fileData,
  });
}
/** 更新项目 POST /api/project/update */
export async function updateList(body: { name?: any; id: string; type?: any; description?: any }) {
  const fileData = new FormData();
  fileData.append('name', body.name);
  fileData.append('type', body.type);
  fileData.append('description', body.description);
  fileData.append('id', body.id);
  return request<TableListItem>('/api/project/update', {
    method: 'POST',
    data: fileData,
  });
}

/** 删除项目 GET project/remove  */
export async function removeList(params: { libraryIds: any }) {
  return request('/api/project/remove', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

/** 生成伪肽段 GET project/generateDecoys  */
export async function generateDecoys(params: { libraryId: any; generator: string }) {
  return request('/api/project/generateDecoys', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

/** 生成基本信息 GET project/statistic  */
export async function statistic(libraryId: string) {
  return request('/api/project/statistic', {
    method: 'GET',
    params: {
      libraryId,
    },
  });
}

/** 统计肽段重复率 GET project/repeatCount  */
export async function repeatCount(libraryId: string) {
  return request('/api/project/repeatCount', {
    method: 'GET',
    params: {
      libraryId,
    },
  });
}

/** 获取肽段列表 GET /peptide/list */
export async function peptideList(params: {
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
