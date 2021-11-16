import { request } from 'umi';
import type { TableListItem } from './data';
import { url } from '@/utils/request';

/** 获取ov列表 GET /overview/list */
export async function overviewList(params: {
  // query
  /** 当前的页码 */
  current?: number;
  /** 页面的容量 */
  pageSize?: number;
  projectId?: string;
  runId?: string;
}) {
  return request(`${url}/overview/list`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}
/** 获取当前项目的Run列表 GET /run/listByProjectId */
export async function runList(params: {
  projectId?: string;
}) {
  return request(`${url}/run/listByProjectId`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}


/** 获取overview详情 GET /overview/detail */
export async function overviewDetail(params: { id?: string }) {
  return request(`${url}/overview/detail`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

/** 更新项目 POST /overview/update */
export async function updateList(params: {
  id: string;
  tags: any;
  note: string;
  defaultOne: boolean;
}) {
  return request<TableListItem>(`${url}/overview/update`, {
    method: 'POST',
    params: {
      ...params,
    },
  });
}
/** 批量修改 POST /overview/batchUpdate */
export async function batchUpdate(params: {
  ids: string[];
  tags: any;
  note: string;
  defaultOne: boolean;
}) {
  return request<TableListItem>(`${url}/overview/batchUpdate`, {
    method: 'POST',
    params: {
      ...params,
    },
  });
}

/** 删除库 GET /overview/remove  */
export async function removeList(params: { overviewIds: any }) {
  return request(`${url}/overview/remove`, {
    method: 'POST',
    params: {
      ...params,
    },
  });
}

/** 重新统计 GET /overview/statistic  */
export async function statistic(params: { idList: any }) {
  return request(`${url}/overview/statistic`, {
    method: 'POST',
    params: {
      ...params,
    },
  });
}


/** POST /overview/reselect  */
export async function reselect(params: { overviewIds: any }) {
  return request(`${url}/analyze/reselect`, {
    method: 'POST',
    params: {
      ...params,
    },
  });
}

