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
      projectId: projectId,
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
export async function updateList(params: { id: string; alias: string }) {
  return request(`${url}/experiment/edit`, {
    method: 'POST',
    params: {
      ...params,
    },
  });
}
/** 生成别名 POST /experiment/generateAlias */
export async function generateAlias(params: { expIds: any }) {
  return request(`${url}/experiment/generateAlias`, {
    method: 'POST',
    params: {
      ...params,
    },
  });
}
