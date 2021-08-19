import { Tag, Tooltip } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { experimentList } from './service';
import type { TableListItem, TableListPagination } from './data';
import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { Icon } from '@iconify/react';
import './index.less';
import DetailForm from './components/DetailForm';
import { Link } from 'umi';

const TableList: React.FC = (props) => {
  // const [formCreate] = Form.useForm();
  // const [formUpdate] = Form.useForm();
  /** 全局弹窗 */
  // const [popup, setPopup] = useState<boolean>(false);
  /** 全选 */
  // const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>();

  /** 更新窗口的弹窗 */
  // const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  /** 库详情的抽屉 */
  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const projectId = props?.location?.query.projectId;

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '实验名称',
      dataIndex: 'name',
      width: '200px',
      render: (dom, entity) => {
        return (
          <Tooltip title={dom} placement="topLeft">
            <a
              onClick={() => {
                setCurrentRow(entity);
                setShowDetail(true);
              }}
              style={{
                display: 'block',
                width: '200px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
              {dom}
            </a>
          </Tooltip>
        );
      },
    },
    {
      title: '实验别名',
      dataIndex: 'alias',
      render: (dom, entity) => {
        if (entity?.alias) {
          return <span>{dom}</span>;
        }
        return false;
      },
    },
    {
      title: '实验类型',
      dataIndex: 'type',
      hideInSearch: true,
      render: (dom) => {
        return <Tag color="green">{dom}</Tag>;
      },
    },
    {
      title: 'Aird文件大小',
      dataIndex: 'airdSize',
      valueType: 'digit',
      hideInSearch: true,
      render: (dom, entity) => {
        const size = (entity.airdSize + entity.airdIndexSize) / 1024 / 1024;
        return <Tag color="green">{size.toFixed(0)}MB</Tag>;
      },
    },
    {
      title: '厂商文件大小',
      dataIndex: 'vendorSize',
      valueType: 'digit',
      hideInSearch: true,
      render: (dom, entity) => {
        const size = (entity.vendorFileSize) / 1024 / 1024;
        return <Tag color="blue">{size.toFixed(0)}MB</Tag>;
      },
    },
    {
      title: 'SWATH窗口',
      dataIndex: 'windowRanges',
      render: (dom, entity) => {
        if (entity?.windowRanges) {
          return (
            <Link
              to={{
                pathname: '/blockIndex',
                search: `?expId=${entity.id}`,
                state: { projectId },
              }}
            >
              <Tag color="blue">{entity?.windowRanges.length}</Tag>
            </Link>
          );
        }
        return false;
      },
    },
    {
      title: 'IRT校验结果',
      dataIndex: 'irt',
      render: (dom, entity) => {
        if (entity?.irt) {
          return <Tag color="green">{dom}</Tag>;
        }
        return false;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      hideInSearch: true,
      valueType: 'dateTime',
      render: (dom, entity) => {
        if (entity?.createDate) {
          return <span>{dom}</span>;
        }
        return false;
      },
    },
    {
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      hideInSearch: true,
      render: (text, record) => [
        <Tooltip title={'详情'} key="detail">
          <a
            onClick={() => {
              setCurrentRow(record);
              setShowDetail(true);
            }}
            key="edit"
          >
            <Icon style={{ verticalAlign: 'middle', fontSize: '20px' }} icon="mdi:file-document" />
          </a>
        </Tooltip>,
        <Tooltip title={'blockIndex'} key="blockIndex">
          <Link
            to={{
              pathname: '/blockIndex',
              search: `?expId=${record.id}`,
              state: { projectId },
            }}
          >
            <Icon
              style={{ verticalAlign: 'middle', fontSize: '20px' }}
              icon="mdi:format-line-spacing"
            />
          </Link>
        </Tooltip>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        scroll={{ x: 'max-content' }}
        headerTitle=""
        actionRef={actionRef}
        rowKey="id"
        size="small"
        search={{
          labelWidth: 120,
        }}
        // request={experimentList}
        request={async (params) => {
          const msg = await experimentList({ projectId, ...params });
          return Promise.resolve(msg);
        }}
        
        columns={columns}
        rowSelection={
          {
            // onChange: (_, selectedRows) => {
            // setSelectedRows(selectedRows);
            // },
          }
        }
      />

      {/* 列表详情 */}
      <DetailForm
        showDetail={showDetail}
        currentRow={currentRow}
        columns={columns}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
      />
    </PageContainer>
  );
};

export default TableList;
