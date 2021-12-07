import { request } from 'umi';
import { url } from '@/utils/request';

/** 准备做蛋白诊断的相关数据 GET /clinic/prepare */
export async function prepare(params: { projectId: string; overviewIds?: [] }) {
  return request(`${url}/clinic/prepare`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

/** 根据蛋白获取对应库下的所有相关肽段 */
export async function getPeptideRefs(params: { libraryId: string | undefined; protein: string }) {
  return request(`${url}/peptide/getPeptideRefs`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

/** 根据肽段信息直接获取某Run下的EIC图像 POST data/getRunData  */
export async function getRunData(params: {
  projectId: string;
  libraryId: string | undefined;
  predict: boolean;
  changeCharge: boolean;
  peptideRef: string;
  smooth: boolean;
  denoise: boolean;
  peakFindMethod:string;
  overviewIds: any[];
}) {
  return request(`${url}/clinic/getRunData`, {
    method: 'POST',
    params: {
      ...params,
    },
  });
}

/** 根据项目ID直接获取该项目的定量结果散点图 GET /bench/peptideRatio  */
export async function getPeptideRatio(params: { projectId: string }) {
  return request(`${url}/bench/peptideRatio`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

/** 根据RunID、肽段的mz、所选的rt 获取该Run的光谱图 POST /clinic/getSpectra  */
export async function getSpectra(params: { runId: string; rt: number; mz?: number }) {
  return request(`${url}/clinic/getSpectra`, {
    method: 'POST',
    params: {
      ...params,
    },
  });
}

/** 根据项目ID、RunID、是否默认获取rtPairs POST /clinic/getRtPairs  */
export async function getRtPairs(params: {
  projectId: string;
  onlyDefault: boolean;
  runIds: string[];
  mz?: string;
}) {
  return request(`${url}/clinic/getRtPairs`, {
    method: 'POST',
    params: {
      ...params,
    },
  });
}
