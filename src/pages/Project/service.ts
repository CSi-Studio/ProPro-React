import { request } from 'umi';
import type { addFormValueType } from './components/CreateForm';
import type { updateFormValueType } from './components/UpdateForm';
import type { TableListItem } from './data';

/** 添加项目前处理 GET /api/project/beforeAdd */
export async function beforeAdd() {
  return request('/api/project/beforeAdd', {
    method: 'GET',
  });
}
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
export async function addList(params: addFormValueType) {
  return request<TableListItem>('/api/project/add', {
    method: 'POST',
    params: {
      ...params,
    },
  });
}
/** 更新项目 POST /api/project/update */
export async function updateList(params: updateFormValueType) {
  return request<TableListItem>('/api/project/update', {
    method: 'POST',
    params: {
      ...params,
    },
  });
}

/** 删除项目 GET project/remove  */
export async function removeList(params: { projectId: any }) {
  return request('/api/project/remove', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}
/** 删除项目 GET project/remove  */
export async function removeAna(params: { projectId: any }) {
  return request('/api/project/remove', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}
/** 删除项目 GET project/remove  */
export async function removeIrt(params: { projectId: any }) {
  return request('/api/project/remove', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

/** 重新扫描项目的实验 GET /project/scan */
export async function peptideScan(params: {
  /** 选择的项目ID */
  projectId?: string;
}) {
  return request('/api/project/scan', {
    method: 'POST',
    params: {
      ...params,
    },
  });
}
