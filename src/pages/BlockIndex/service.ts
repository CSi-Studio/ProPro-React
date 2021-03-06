import { request } from 'umi';
import { url } from '@/utils/request';

/** 获取BlockIndex详情 GET /blockindex/detail */
export async function blockIndexDetail(params: { id?: string }) {
  return request(`${url}/blockindex/detail`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

/** 获取BlockIndex GET /blockindex/list */
export async function blockIndexList(params: {
  // query
  /** 当前的页码 */
  pageNo?: number;
  /** 页面的容量 */
  pageSize?: number;
  runId?: string;
  mzStart?: any;
  mzEnd?: any;
}) {
  return request(`${url}/blockindex/list`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

/** 获取BlockIndex GET /blockindex/spectrum */
export async function spectrumCharts(params: { blockIndexId: string; rt: any }) {
  return request(`${url}/blockindex/spectrum`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

/** 获取BlockIndex GET /blockindex/spectrumGauss */
export async function spectrumGauss(params: {
  blockIndexId:string;
  rt:any;
  pointNum:number
}) {
  return request(`${url}/blockindex/spectrumGauss`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}
