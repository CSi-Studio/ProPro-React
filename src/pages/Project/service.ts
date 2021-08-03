import { request } from 'umi';
import type { TableListItem } from './data';
// import { TableListItem } from './data';

export async function rule() {
  return request('/api/restProject/list', {
    method: 'GET',
  });
}

/** 获取规则列表 GET /api/rule */
// export async function rule(
//   params: {
//     // query
//     current?: number;
//     pageSize?: number;
//   },
//   options?: Record<string, any>,
// ) {
//   return request<{
//     data: TableListItem[];
//     /** 列表的内容总数 */
//     total?: number;
//     success?: boolean;
//   }>('/api/rule', {
//     method: 'GET',
//     params: {
//       ...params,
//     },
//     ...(options || {}),
//   });
// }

/** 新建规则 PUT /api/rule */
export async function updateRule(options?: Record<string, any>) {
  return request<TableListItem>('/api/rule', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: Record<string, any>) {
  return request<TableListItem>('/api/rule', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: Record<string, any>) {
  return request<Record<string, any>>('/api/rule', {
    method: 'DELETE',
    ...(options || {}),
  });
}
