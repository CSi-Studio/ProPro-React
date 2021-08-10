import { message, Tooltip } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { proteinList } from './service';
import type { TableListItem, TableListPagination } from './data';
import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { Icon } from '@iconify/react';

const TableList: React.FC = (props) => {
  /** 全局弹窗 */
  // const [popup, setPopup] = useState<boolean>(false);
  /** 全选 */
  // const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>();

  const { libraryId } = props?.location?.query;

  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '标识符',
      dataIndex: 'identifier',
      width: '100px',
      render: (dom, entity) => {
        return (
          <Tooltip title={dom} placement="topLeft">
            <div
              style={{
                width: '150px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              <a
                onClick={() => {
                  setCurrentRow(entity);
                }}
              >
                {dom}
              </a>
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: '审核与否',
      dataIndex: 'reviewed',
      hideInSearch: true,
      render: (dom, entity) => {
        return entity.reviewed ? '✅' : '❌';
      },
    },
    {
      title: '蛋白质名称',
      dataIndex: 'names',
      render: (dom, entity) => {
        return (
          <Tooltip title={dom} placement="topLeft">
            <div
              style={{
                width: '150px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {dom[0]}
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: '有机生物',
      dataIndex: 'organism',
    },
    {
      title: '基因🧬',
      dataIndex: 'gene',
    },
    {
      title: '序列号',
      dataIndex: 'sequence',
      render: (dom, entity) => {
        return (
          <Tooltip title={dom} placement="topLeft">
            <div
              style={{
                width: '150px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              <a
                onClick={() => {
                  setCurrentRow(entity);
                }}
              >
                {dom}
              </a>
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: 'UniProt链接🔗',
      dataIndex: 'uniPortLink',
      render: (dom, entity) => {
        return (
          <a href={entity.uniPortLink ? entity.uniPortLink : 'http://www.csibio.net/'}>UniProt</a>
        );
      },
    },
    {
      title: 'alphaFoldLink链接🔗',
      dataIndex: 'alphaFoldLink',
      render: (dom, entity) => {
        return (
          <a href={entity.alphaFoldLink ? entity.alphaFoldLink : 'http://www.csibio.net/'}>
            AlphaFold
          </a>
        );
      },
    },
  ];
  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        scroll={{ x: 'max-content' }}
        headerTitle={
          props?.location?.state?.libraryName == undefined
            ? ''
            : props?.location?.state?.libraryName
        }
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        request={proteinList}
        // dataSource={tableListDataSource}
        columns={columns}
        rowSelection={
          {
            // onChange: (_, selectedRows) => {
            // setSelectedRows(selectedRows);
            // },
          }
        }
      />
    </PageContainer>
  );
};

export default TableList;
