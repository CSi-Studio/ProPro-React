import { request } from 'umi';
import { url } from '@/utils/request';
import type { Task } from '@/components/Commons/common'
import type { PrepareAnalyzeVO, AnalyzeParams } from './data'


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
export async function prepare() {
  return request(`${url}/analyze/prepare`, {
    method: 'GET',
  });
}

/** 添加项目 POST /api/project/add */
export async function analyze(params: AnalyzeParams) {
  return request<Task>(`${url}/analyze/analyze`, {
    method: 'POST',
    params: {
      ...params,
    },
  });
}
