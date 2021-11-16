import { request } from 'umi';
import type { addFormValueType } from './components/CreateForm';
import type { updateFormValueType } from './components/UpdateForm';
import type { TableListItem } from './data';
import {url} from '@/utils/request'

/** 添加项目前处理 GET /api/project/beforeAdd */
export async function beforeAdd() {
  return request(`${url}/project/beforeAdd`, {
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
  return request(`${url}/project/list`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

/** 添加项目 POST /api/project/add */
export async function addList(params: addFormValueType) {
  return request<TableListItem>(`${url}/project/add`, {
    method: 'POST',
    params: {
      ...params,
    },
  });
}
/** 更新项目 POST /api/project/update */
export async function updateList(params: updateFormValueType) {
  return request<TableListItem>(`${url}/project/update`, {
    method: 'POST',
    params,
  });
}

/** 删除项目 GET project/remove  */
export async function removeList(params: { projectId: any }) {
  return request(`${url}/project/remove`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}
/** 删除项目 GET project/remove  */
export async function removeRes(params: { projectId: any }) {
  return request(`${url}/project/removeAna`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}
/** 删除项目 GET project/remove  */
export async function removeIrt(params: { projectId: any }) {
  return request(`${url}/project/removeIrt`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

/** 重新扫描项目的Run GET /project/scan */
export async function peptideScan(params: {
  /** 选择的项目ID */
  projectId?: string;
}) {
  return request(`${url}/project/scan`, {
    method: 'POST',
    params: {
      ...params,
    },
  });
}


/** 导出项目报告 POST /project/report */
export async function report(params: {
  /** 选择的项目ID */
  projectId?: string;
}) {
  return request(`${url}/excel/report`, {
    method: 'POST',
    params: {
      ...params,
    },
  });
}