/* eslint-disable no-console */
import { Icon } from '@iconify/react';
import { EditFilled, CopyFilled, DeleteFilled } from '@ant-design/icons';
import React, { useState, useRef } from 'react';
import { Button, message, Tag, Tooltip } from 'antd';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { rule, addRule, updateRule, removeRule } from './service';
import type { TableListItem, TableListPagination } from './data';
import type { FormValueType } from './components/UpdateForm';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import DeleteForm from './components/DeleteForm';
import './index.less';

/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields: TableListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addRule({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};
/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('editing');
  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    });
    hide();
    message.success('Configuration is successful');
    return true;
  } catch (error) {
    hide();
    message.error('Configuration failed, please try again!');
    return false;
  }
};
/**
 * 删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.RuleListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeRule({
      key: selectedRows.map((row) => row.key),
    });
    hide();
    message.success('Deleted successfully and will refresh soon');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};

const TableList: React.FC = () => {
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 删除窗口的弹窗 */
  const [deleteModalVisible, handleDeleteModalVisible] = useState<boolean>(false);
  /** 更新窗口的弹窗 */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.RuleListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);

  const tableListDataSource: TableListItem[] = [];
  for (let i = 0; i < 5; i += 1) {
    tableListDataSource.push({
      key: i,
      id: '60fe42a2a6e37f184dba9594',
      name: 'IRT_SGS',
      type: 'IRT标准库',
      decoyGenerator: 'shuffle',
      proteinsCount: 6846,
      peptidesCount: 34646,
      ppRate: '6.5443322134',
      description: '这是一个测试',
      creator: 'lihua',
      createDate: Date.now(),
      totalSize: 5,
    });
  }

  const tableListDataSource1: TableListItem[] = [
    {
      key: 1,
      id: '60fe42a2a6e37f184dba9594',
      name: 'IRT_SGS',
      type: 'IRT标准库',
      decoyGenerator: 'nice',
      proteinsCount: 6845,
      peptidesCount: 34646,
      ppRate: '6.5443322134',
      description: '这是一个测试',
      creator: 'lihuae',
      createDate: Date.now(),
      totalSize: 5,
    },
    {
      key: 2,
      id: '60fe42a2a6e37f184234esfr',
      name: 'IRT_SGS',
      type: 'IRT标准库',
      decoyGenerator: 'shuffle',
      proteinsCount: 6844,
      peptidesCount: 34646,
      ppRate: '2.5443322134',
      description: '这是一个测试',
      creator: 'lihuaa',
      createDate: Date.now(),
      totalSize: 5,
    },
    {
      key: 3,
      id: '60fe42a2a6e37f184234dsf',
      name: 'IRT_SGS',
      type: 'IRT校准库',
      decoyGenerator: 'nice',
      proteinsCount: 6841,
      peptidesCount: 34646,
      ppRate: '7.5443322134',
      description: '这是一个测试',
      creator: 'lihuaf',
      createDate: Date.now(),
      totalSize: 5,
    },
    {
      key: 4,
      id: '60fe42a2a6e37f42342sdw',
      name: 'IRT_SGS',
      type: 'IRT校准库',
      decoyGenerator: 'nice',
      proteinsCount: 6843,
      peptidesCount: 34646,
      ppRate: '4.544332332134',
      description: '这是2个测试',
      creator: 'lihua',
      createDate: Date.now(),
      totalSize: 5,
    },
    {
      key: 5,
      id: '60fe42a2a6e37f18234sdfsf',
      name: 'IRT_SGS',
      type: 'IRT校准库',
      decoyGenerator: 'shuffle',
      proteinsCount: 6842,
      peptidesCount: 34646,
      ppRate: '5.544332214',
      description: '这是3个测试',
      creator: 'lihua',
      createDate: Date.now(),
      totalSize: 5,
    },
  ];

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '标准库ID',
      dataIndex: 'id',
      sorter: (a, b) => (a.id > b.id ? -1 : 1),
    },
    {
      title: '标准库名称',
      dataIndex: 'name',
      sorter: (a, b) => (a.name > b.name ? -1 : 1),
      render: (dom, entity) => {
        return <a>{dom}</a>;
      },
    },
    {
      title: '库类型',
      dataIndex: 'type',
      sorter: (a, b) => (a.type > b.type ? -1 : 1),
      render: (dom) => {
        // eslint-disable-next-line array-callback-return
        return <Tag>{dom}</Tag>;
      },
    },
    {
      title: 'Decoy Generator',
      dataIndex: 'decoyGenerator',
      sorter: (a, b) => (a.decoyGenerator > b.decoyGenerator ? -1 : 1),
      filters: true,
      onFilter: true,
      valueEnum: {
        shuffle: {
          text: 'shuffle',
        },
        nice: {
          text: 'nice',
        },
      },
      render: (dom) => {
        // eslint-disable-next-line array-callback-return
        return <Tag>{dom}</Tag>;
      },
    },
    {
      title: '蛋白质数目',
      dataIndex: 'proteinsCount',
      sorter: (a, b) => (a.proteinsCount > b.proteinsCount ? -1 : 1),
      render: (dom, entity) => {
        return <a>{dom}</a>;
      },
    },
    {
      title: '肽段数目',
      dataIndex: 'peptidesCount',
      sorter: (a, b) => (a.peptidesCount > b.peptidesCount ? -1 : 1),
      render: (dom, entity) => {
        return <a>{dom}</a>;
      },
    },
    {
      title: '肽段 / 蛋白覆盖度',
      dataIndex: 'ppRate',
      sorter: (a, b) => (a.ppRate > b.ppRate ? -1 : 1),
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      sorter: (a, b) => (a.createDate > b.createDate ? -1 : 1),
      valueType: 'dateTime',
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      sorter: (a, b) => (a.creator > b.creator ? -1 : 1),
    },
    {
      title: '操作',
      valueType: 'option',
      copyable: true,
      width: 100,
      ellipsis: true,
      fixed: 'right',
      render: (text, record, index, action) => [
        <Tooltip title={'编辑'} key="edit">
          <a
            onClick={() => {
              handleUpdateModalVisible(true);
              setCurrentRow(record);
            }}
            key="edit"
          >
            <EditFilled />
          </a>
        </Tooltip>,
        <Tooltip title={'复制'} key="copy">
          <a
            key="copy"
            onClick={() => {
              action?.startEditable?.(record.id);
            }}
          >
            <CopyFilled />
          </a>
        </Tooltip>,
        <Tooltip title={'删除'} key="delete">
          <a
            key="delete"
            onClick={() => {
              handleDeleteModalVisible(true);
              setCurrentRow(record);

              // await handleRemove(selectedRowsState);
              // setSelectedRows([]);
              // actionRef.current?.reloadAndRest?.();
            }}
          >
            <DeleteFilled />
          </a>
        </Tooltip>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        scroll={{ x: 'max-content' }}
        headerTitle={''}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <Icon style={{ verticalAlign: 'middle', fontSize: '20px' }} icon="mdi:playlist-plus" />
            创建库
          </Button>,
        ]}
        // request={rule}
        dataSource={tableListDataSource1}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              项 &nbsp;&nbsp;
            </div>
          }
        ></FooterToolbar>
      )}
      {/* 新建列表 */}
      <CreateForm
        onCancel={{
          onCancel: () => handleModalVisible(false),
        }}
        onSubmit={async (value) => {
          const success = await handleAdd(value as TableListItem);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        createModalVisible={createModalVisible}
        values={currentRow || {}}
      />
      {/* 编辑列表 */}
      <UpdateForm
        onCancel={{
          onCancel: () => handleUpdateModalVisible(false),
        }}
        onSubmit={async (value) => {
          handleUpdateModalVisible(false);
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        updateModalVisible={updateModalVisible}
        values={currentRow || {}}
      />
      {/* 删除列表 */}
      <DeleteForm
        onCancel={{
          onCancel: () => handleDeleteModalVisible(false),
        }}
        onSubmit={async (value) => {
          handleDeleteModalVisible(false);
          const success = await handleRemove(value);
          if (success) {
            handleDeleteModalVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        deleteModalVisible={deleteModalVisible}
        values={currentRow || {}}
      />
    </PageContainer>
  );
};

export default TableList;
