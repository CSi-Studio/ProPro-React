import { request } from 'umi';
import { url } from '@/utils/request';
import type { AnalyzeParams } from './data';

/** 获取Run列表 GET /run/list */
export async function runList(params: {
  // query
  projectId?: string;
  /** 当前的页码 */
  pageNo?: number;
  /** 页面的容量 */
  pageSize?: number;
}) {
  return request(`${url}/run/list`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

/** 获取分析前的参数 GET /analyze/prepare */
export async function prepare(projectId: string) {
  return request(`${url}/analyze/prepare`, {
    method: 'GET',
    params: {
      projectId,
    },
  });
}

/** 添加项目 POST /analyze/analyze */
export async function analyze(params: AnalyzeParams) {
  return request(`${url}/analyze/analyze`, {
    method: 'POST',
    params: {
      ...params,
    },
  });
}

/** 更新项目 POST /run/edit */
export async function updateList(params: {
  id: string;
  alias: string;
  group: string;
  fragMode: string;
  tags: Set<string>;
}) {
  return request(`${url}/run/edit`, {
    method: 'POST',
    params: {
      ...params,
    },
  });
}

/** 批量编辑组和标签 POST /run/batchEdit */
export async function batchEdit(params: {
  ids: string[];
  fragMode: string;
  group: string;
  tags: Set<string>;
}) {
  return request(`${url}/run/batchEdit`, {
    method: 'POST',
    params: {
      ...params,
    },
  });
}

/** 生成别名 POST /run/generateAlias */
export async function generateAlias(params: {
  runIds: string[];
  prefix: string;
  projectId: string;
}) {
  return request(`${url}/run/generateAlias`, {
    method: 'POST',
    params: {
      ...params,
    },
  });
}

/** 获取库列表 GET /library/getPeptide */
export async function getPeptide(params: { projectId: any; proteinName: string; range: any }) {
  return request(`${url}/library/getPeptide`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function getProteins(params: { projectId: string }) {
  return request(`${url}/library/getProteins`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}
