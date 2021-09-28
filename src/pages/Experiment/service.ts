import { request } from 'umi';
import { url } from '@/utils/request';
import type { AnalyzeParams } from './data';

/** 获取实验列表 GET /experiment/list */
export async function experimentList(params: {
  // query
  projectId?: string;
  /** 当前的页码 */
  pageNo?: number;
  /** 页面的容量 */
  pageSize?: number;
}) {
  return request(`${url}/experiment/list`, {
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

/** 更新项目 POST /experiment/edit */
export async function updateList(params: { id: string; alias: string; group: string; tags: Set<string> }) {
  return request(`${url}/experiment/edit`, {
    method: 'POST',
    params: {
      ...params,
    },
  });
}
/** 生成别名 POST /experiment/generateAlias */
export async function generateAlias(params: {
  expIds: string[];
  prefix: string;
  projectId: string;
}) {
  return request(`${url}/experiment/generateAlias`, {
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
