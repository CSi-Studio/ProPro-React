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
import { useIntl, FormattedMessage } from 'umi';

const TableList: React.FC = () => {
  const intl = useIntl();

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
      const messageSuccess = intl.formatMessage({
        id: 'message.deleteSuccess',
        defaultMessage: '删除成功！',
      });
      message.success(messageSuccess);
      return true;
    } catch (error) {
      const messageFail = intl.formatMessage({
        id: 'message.deleteFail',
        defaultMessage: '删除失败，请重试！',
      });
      message.error(messageFail);
      return false;
    }
  };
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
      title: <FormattedMessage id="table.taskName" />,
      dataIndex: 'name',
      render: (text, record) => {
        return (
          <Tooltip title={`Id:${record.id}`} placement="topLeft">
            <a
              onClick={() => {
                setCurrentRow(record);
                setShowDetail(true);
              }}
            >
              {text}
            </a>
          </Tooltip>
        );
      },
    },
    {
      title: 'TaskId',
      dataIndex: 'id',
      hideInTable: true,
      render: (text, record) => {
        return <Tag>{text}</Tag>;
      },
    },
    {
      title: <FormattedMessage id="table.taskTem" />,
      dataIndex: 'taskTemplate',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="table.taskState" />,
      dataIndex: 'status',
      hideInSearch: true,
      render: (text, record) => {
        if (record.status === 'SUCCESS') {
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
      title: <FormattedMessage id="table.takeTime" />,
      hideInSearch: true,
      dataIndex: 'totalCost',
      align: 'right',
      width: '100px',
      showSorterTooltip: false,
      sorter: (a, b) => (a.totalCost > b.totalCost ? -1 : 1),
      render: (text, record) => {
        if (record.totalCost >= 1000) {
          return <Tag>{record.totalCost / 1000}m</Tag>;
        }
        if (record.totalCost) {
          return <Tag>{text}ms</Tag>;
        }
        return <Tag>Not started</Tag>;
      },
    },
    {
      title: <FormattedMessage id="table.creatTime" />,
      hideInSearch: true,
      dataIndex: 'createDate',
      valueType: 'dateTime',
    },
    {
      title: <FormattedMessage id="table.option" />,
      valueType: 'option',
      fixed: 'right',
      width: '100',
      hideInSearch: true,
      render: (text, record) => (
        <>
          <a
            onClick={() => {
              setCurrentRow(record);
              setShowDetail(true);
            }}
            key="detail"
          >
            <Tag color="blue">
              <Icon style={{ verticalAlign: '-4px', fontSize: '16px' }} icon="mdi:file-document" />
              <FormattedMessage id="table.detail" />
            </Tag>
          </a>
        </>
      ),
    },
  ];
  /* 点击行选中相关 */
  const selectRow = (record: any) => {
    const rowData = [...selectedRows];
    if (rowData.length === 0) {
      rowData.push(record);
      setSelectedRows(rowData);
    } else {
      if (rowData.indexOf(record) >= 0) {
        rowData.splice(rowData.indexOf(record), 1);
      } else {
        rowData.push(record);
      }
      setSelectedRows(rowData);
    }
  };
  return (
    <>
      <ProTable<TaskTableItem, Pagination>
        scroll={{ x: 'max-content' }}
        headerTitle={intl.formatMessage({
          id: 'table.taskName',
          defaultMessage: '任务列表',
        })}
        search={{ labelWidth: 'auto' }}
        actionRef={actionRef}
        rowKey="id"
        size="small"
        tableAlertRender={false}
        toolBarRender={() => [
          <a
            key="delete"
            onClick={async () => {
              formDelete?.resetFields();
              if (selectedRows?.length > 0) {
                handleDeleteModalVisible(true);
              } else {
                const deleteMes = intl.formatMessage({
                  id: 'message.deleteTask',
                  defaultMessage: '请选择要删除的库，支持多选',
                });
                message.warn(deleteMes);
              }
            }}
          >
            <Tag color="error">
              <Icon style={{ verticalAlign: '-4px', fontSize: '16px' }} icon="mdi:delete" />
              <FormattedMessage id="table.delete" />
            </Tag>
          </a>,
        ]}
        request={async (params) => {
          const msg = await list({ ...params });
          setTotal(msg.totalNum);
          return Promise.resolve(msg);
        }}
        pagination={{
          total,
        }}
        columns={columns}
        onRow={(record) => {
          return {
            onClick: () => {
              selectRow(record);
            },
          };
        }}
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
          if (value.name === 'ok fine') {
            const success = await handleRemove(selectedRows);
            if (success) {
              handleDeleteModalVisible(false);
              setSelectedRows([]);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          } else {
             const inputFail = intl.formatMessage({
               id: 'message.deleteInputFail',
               defaultMessage: '输入错误，请重新输入！',
             });
             message.error(inputFail);
          }
        }}
        deleteModalVisible={deleteModalVisible}
      />
    </>
  );
};

export default TableList;
