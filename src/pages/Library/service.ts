import { request } from 'umi';
import type { TableListItem } from './data';

/** 获取库列表 GET /library/list */
export async function libraryList() {
  return request('/api/library/list', {
    method: 'GET',
  });
}

/** 添加库 POST /api/library/add */
export async function addList(body: { name?: any; type?: any; filePath?: any; description?: any }) {
  const fileData = new FormData();
  fileData.append('name', body.name);
  fileData.append('type', body.type);
  fileData.append('libFile', body.filePath[0].originFileObj);
  fileData.append('description', body.description);
  return request<TableListItem>('/api/library/add', {
    method: 'POST',
    header: {
      Accept: 'application/json',
    },
    data: fileData,
  });
}
/** 更新库 POST /api/library/update */
export async function updateList(body: { name?: any; id: string; type?: any; description?: any }) {
  const fileData = new FormData();
  fileData.append('name', body.name);
  fileData.append('type', body.type);
  fileData.append('description', body.description);
  fileData.append('id', body.id);
  return request<TableListItem>('/api/library/update', {
    method: 'POST',
    data: fileData,
  });
}

/** 克隆库 GET library/remove  */
export async function cloneList(params: { id: any; newLibName: string; includeDecoy?: boolean }) {
  return request('/api/library/clone', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

/** 删除库 GET library/remove  */
export async function removeList(params: { libraryIds: any }) {
  return request('/api/library/remove', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

/** 生成伪肽段 GET library/generateDecoys  */
export async function generateDecoys(params: { libraryId: any; generator: string }) {
  return request('/api/library/generateDecoys', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

/** 生成基本信息 GET library/statistic  */
export async function statistic(libraryId: string) {
  return request('/api/library/statistic', {
    method: 'GET',
    params: {
      libraryId,
    },
  });
}

/** 统计肽段重复率 GET library/statistic  */
export async function repeatCount(libraryId: string) {
  return request('/api/library/repeatCount', {
    method: 'GET',
    params: {
      libraryId,
    },
  });
}
