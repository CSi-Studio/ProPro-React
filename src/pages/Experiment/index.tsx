import { Tag, Tooltip, Form, Button } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { experimentList, analyze } from './service';
import type { AnalyzeParams, TableListItem, TableListPagination } from './data';
import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { Icon } from '@iconify/react';
import DetailForm from './components/DetailForm';
import AnalyzeForm from './components/AnalyzeForm';
import { Link } from 'umi';

const TableList: React.FC = (props) => {
  const [formAnalyze] = Form.useForm();
  const [analyzeModalVisible, handleAnalyzeModalVisible] = useState<boolean>(false);
  // const [formUpdate] = Form.useForm();
  /** 全局弹窗 */
  // const [popup, setPopup] = useState<boolean>(false);
  /** 全选 */
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>();

  /** 更新窗口的弹窗 */
  // const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  /** 库详情的抽屉 */
  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const projectId = props?.location?.query.projectId;

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '实验名',
      dataIndex: 'name',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '类型',
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
        const size = entity.vendorFileSize / 1024 / 1024;
        return <Tag color="blue">{size.toFixed(0)}MB</Tag>;
      },
    },
    {
      title: 'SWATH窗口',
      dataIndex: 'windowRanges',
      render: (dom, entity) => {
        if (entity?.windowRanges) {
          return (
            <>
              <Tag color="blue">{entity?.windowRanges.length}</Tag>
              <Link
                to={{
                  pathname: '/blockIndex',
                  search: `?expId=${entity.id}`,
                  state: { projectId },
                }}
              >
                <Tag color="green">查看</Tag>
              </Link>
            </>
          );
        }
        return false;
      },
    },
    {
      title: 'IRT校验结果',
      dataIndex: 'irt',
      render: (dom, entity) => {
        if (entity.irt) {
          return <Tag color="green">{dom}</Tag>;
        }else{
          return <Tag color="red">未分析</Tag>;
        }
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
    <>
      <ProTable<TableListItem, TableListPagination>
        scroll={{ x: 'max-content' }}
        headerTitle=""
        actionRef={actionRef}
        rowKey="id"
        size="small"
        // request={experimentList}
        request={async (params) => {
          const msg = await experimentList({ projectId, ...params });
          return Promise.resolve(msg);
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleAnalyzeModalVisible(true);
            }}
          >
            <Icon style={{ verticalAlign: 'middle', fontSize: '20px' }} icon="mdi:playlist-plus" />{' '}开始分析
          </Button>,
        ]}
        columns={columns}
        rowSelection={
          {
            // onChange: (_, selectedRows) => {
            // setSelectedRows(selectedRows);
            // },
          }
        }
      />

      <AnalyzeForm
        form={formAnalyze}
        onCancel={{
          onCancel: () => {
            handleAnalyzeModalVisible(false);
            formAnalyze?.resetFields();
          },
        }}
        onSubmit={async (value: AnalyzeParams) => {
          const success = await analyze(value);
          if (success) {
            handleAnalyzeModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        analyzeModalVisible={analyzeModalVisible}
        values={
          {expIdList: selectedRowsState,
          projectId: projectId}
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
    </>
  );
};

export default TableList;
