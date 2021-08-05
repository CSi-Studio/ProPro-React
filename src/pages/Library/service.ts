import { request } from 'umi';
import type { TableListItem } from './data';

export async function libraryList() {
  return request('/api/library/list', {
    method: 'GET',
  });
}

/** 新建规则 PUT /api/rule */
export async function updateRule(options?: Record<string, any>) {
  return request<TableListItem>('/api/rule', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 添加列表 /api/library/add */
export async function addRule(body: { name?: any; type?: any; filePath?: any; description?: any }) {
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

/** 删除规则 DELETE library/remove?libraryIds=610a3c485cd788258fa315b3  */
export async function removeRule(params: {
  // query
  libraryIds: any[];
}) {
  return request('/api/library/remove', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}
