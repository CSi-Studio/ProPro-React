import { message, Tooltip, Form, Tag } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import type { TaskTableItem } from './data';
import type { Pagination } from '@/components/Commons/common';
import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { Icon } from '@iconify/react';
import { list, removeList } from './service';
import DeleteForm from './components/DeleteForm';
import { CheckCircleOutlined, SyncOutlined } from '@ant-design/icons';
import DetailForm from './components/DetailForm';

/**
 * 删除库
 * @param selectedRows
 */
const handleRemove = async (selectedRows: any[]) => {
  const idList = selectedRows.map((item) => {
    return item.id;
  });
  try {
    await removeList({
      idList,
    });
    message.success('删除成功，希望你不要后悔 🥳');
    return true;
  } catch (error) {
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList: React.FC = () => {
  const [formDelete] = Form.useForm();
  // /** 全选 */
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  /** 库详情的抽屉 */
  const [showDetail, setShowDetail] = useState<boolean>(false);
  /** 删除窗口的弹窗 */
  const [deleteModalVisible, handleDeleteModalVisible] = useState<boolean>(false);

  const [total, setTotal] = useState<any>();
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TaskTableItem>();
  const columns: ProColumns<TaskTableItem>[] = [
    {
      title: '任务名称',
      dataIndex: 'name',
      render: (text, record) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(record);
              setShowDetail(true);
            }}
          >
            {text}
          </a>
        );
      },
    },
    {
      title: '任务模板',
      dataIndex: 'taskTemplate',
      hideInSearch: true,
    },
    {
      title: '任务状态',
      dataIndex: 'status',
      hideInSearch: true,
      render: (text, record) => {
        if (record.status == 'SUCCESS') {
          return (
            <Tag icon={<CheckCircleOutlined />} color="success">
              {text}
            </Tag>
          );
        }
        return (
          <Tag icon={<SyncOutlined spin />} color="warning">
            {text}
          </Tag>
        );
      },
    },
    {
      title: '花费时间',
      hideInSearch: true,
      dataIndex: 'totalCost',
      align: 'right',
      width: '100px',
      sorter: (a, b) => (a.totalCost > b.totalCost ? -1 : 1),
      render: (text, record) => {
        if (record.totalCost >= 1000) {
          return <Tag>{record.totalCost / 1000}m</Tag>;
        }
        if (record.totalCost) {
          return <Tag>{text}ms</Tag>;
        }
        return <Tag>未开始</Tag>;
      },
    },
    {
      title: '创建时间',
      hideInSearch: true,
      dataIndex: 'createDate',
      valueType: 'dateTime',
    },
    {
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      width: '100',
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
            <Tag color="blue">
              <Icon style={{ verticalAlign: '-4px', fontSize: '16px' }} icon="mdi:file-document" />
              详情
            </Tag>
          </a>
        </Tooltip>,
      ],
    },
  ];
  return (
    <>
      <ProTable<TaskTableItem, Pagination>
        scroll={{ x: 'max-content' }}
        headerTitle="任务列表"
        search={{ labelWidth: 'auto' }}
        actionRef={actionRef}
        rowKey="id"
        size="small"
        tableAlertRender={false}
        toolBarRender={() => [
          <Tooltip placement="top" title={'删除'} key="delete">
            <a
              key="delete"
              onClick={async () => {
                formDelete?.resetFields();
                if (selectedRows?.length > 0) {
                  handleDeleteModalVisible(true);
                } else {
                  message.warn('请选择要删除的库，支持多选');
                }
              }}
            >
              <Tag color="error">
                <Icon style={{ verticalAlign: '-4px', fontSize: '16px' }} icon="mdi:delete" />
                删除
              </Tag>
            </a>
          </Tooltip>,
        ]}
        request={async (params) => {
          const msg = await list({ ...params });
          setTotal(msg.totalNum);
          return Promise.resolve(msg);
        }}
        pagination={{
          total: total,
        }}
        columns={columns}
        rowSelection={{
          selectedRowKeys: selectedRows?.map((item) => {
            return item.id;
          }),
          onChange: (_, selectedRowKeys) => {
            setSelectedRows(selectedRowKeys);
          },
        }}
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
      {/* 删除列表 */}
      <DeleteForm
        selectedRows={selectedRows}
        form={formDelete}
        onCancel={() => {
          handleDeleteModalVisible(false);
          setSelectedRows([]);
          formDelete?.resetFields();
        }}
        onSubmit={async (value) => {
          if (value.name === '我确认删除') {
            const success = await handleRemove(selectedRows);
            if (success) {
              handleDeleteModalVisible(false);
              setSelectedRows([]);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          } else {
            message.error('你没有删除的决心，给👴🏻 爬');
          }
        }}
        deleteModalVisible={deleteModalVisible}
      />
    </>
  );
};

export default TableList;
