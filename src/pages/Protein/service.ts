import { request } from 'umi';
import { TableAddItem } from './data';

/** 获取肽段列表 GET /peptide/list */
export async function proteinList(params: {
  // query
  /** 当前的页码 */
  current?: number;
  /** 页面的容量 */
  pageSize?: number;
  /** 选择的标准库ID */
}) {
  return request('/api/protein/list', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

/** 添加蛋白fasta文件 POST /api/library/add */
export async function addList(body: {
  createTag?: any;
  reviewed?: any;
  createLibrary?: any;
  libraryName?: any;
  filePath?: any;
  spModel?: any;
  isotope?: any;
  minPepLen?: any;
  maxPepLen?: any;
}) {
  const fileData = new FormData();
  fileData.append('createTag', body.createTag);
  fileData.append('reviewed', body.reviewed);
  fileData.append('createLibrary', body.createLibrary);
  fileData.append('libraryName', body.libraryName);
  fileData.append('libFile', body.filePath[0].originFileObj);
  fileData.append('spModel', body.spModel);
  fileData.append('isotope', body.isotope);
  fileData.append('minPepLen', body.minPepLen);
  fileData.append('maxPepLen', body.maxPepLen);
  return request<TableAddItem>('/api/protein/add', {
    method: 'POST',
    header: {
      Accept: 'application/json',
    },
    data: fileData,
  });
}
