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
import DetailForm from './components/DetailForm';

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
/**
 * 查看节点
 * @param id
 */
const handleDetail = async (id: string) => {
  if (!id) return true;
};

const TableList: React.FC = () => {
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 删除窗口的弹窗 */
  const [deleteModalVisible, handleDeleteModalVisible] = useState<boolean>(false);
  /** 更新窗口的弹窗 */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  /** 库详情的抽屉 */
  const [detailModalVisible, handleDetailModalVisible] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.RuleListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);

  const tableListDataSource: TableListItem[] = [
    {
      key: 1,
      id: '60fe42a2a6e37f184dba2222',
      name: 'IRT',
      filePath: 'c:123/123',
      type: '标准库',
      description: '这是2个测试',
      generator: 'nice',
      statistic: { a: '2' },
      region: ['尾'],
      species: ['猫'],
      createDate: Date.now(),
      lastModifiedDate: Date.now(),
    },
    {
      key: 2,
      id: '60fe42a2a6e37f184dba3333',
      name: 'IRT_SGS',
      filePath: 'c:123/123',
      type: 'IRT标准库',
      description: '这是3个测试',
      generator: 'shuffle',
      statistic: { a: '3' },
      region: ['头'],
      species: ['狗'],
      createDate: Date.now(),
      lastModifiedDate: Date.now(),
    },
    {
      key: 3,
      id: '60fe42a2a6e37f184dba4444',
      name: 'IRT',
      filePath: 'c:123/123',
      type: 'IRT校准库',
      description: '这是4个测试',
      generator: 'nice',
      statistic: { a: '4' },
      region: ['肺'],
      species: ['马'],
      createDate: Date.now(),
      lastModifiedDate: Date.now(),
    },
    {
      key: 4,
      id: '60fe42a2a6e37f184dba5555',
      name: 'IRT_SGS',
      filePath: 'c:123/123',
      type: '标准库',
      description: '这是5个测试',
      generator: 'shuffle',
      statistic: { a: '5' },
      region: ['肝'],
      species: ['牛'],
      createDate: Date.now(),
      lastModifiedDate: Date.now(),
    },
    {
      key: 5,
      id: '60fe42a2a6e37f184dba6666',
      name: 'IRT',
      filePath: 'c:123/123',
      type: 'IRT标准库',
      description: '这是6个测试',
      generator: 'nice',
      statistic: { a: '6' },
      region: ['胃', '肝'],
      species: ['羊'],
      createDate: Date.now(),
      lastModifiedDate: Date.now(),
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
        return (
          <a
            onClick={() => {
              handleDetailModalVisible(true);
              const a = tableListDataSource.filter((value: Record<string, unknown>) => {
                return value.id === entity.id;
              });
              console.log(a[0].id);
            }}
          >
            {dom}
          </a>
        );
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
      title: 'Generator',
      dataIndex: 'generator',
      sorter: (a, b) => (a.generator > b.generator ? -1 : 1),
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
      title: '标准库地址',
      dataIndex: 'filePath',
      sorter: (a, b) => (a.filePath > b.filePath ? -1 : 1),
      render: (dom, entity) => {
        return <a>{dom}</a>;
      },
    },
    {
      title: '描述信息',
      dataIndex: 'description',
      sorter: (a, b) => (a.description > b.description ? -1 : 1),
      render: (dom, entity) => {
        return <a>{dom}</a>;
      },
    },
    {
      title: '物种',
      dataIndex: 'region',
      sorter: (a, b) => (a.region > b.region ? -1 : 1),
      render: (dom) => {
        // eslint-disable-next-line array-callback-return
        return <Tag>{dom}</Tag>;
      },
    },
    {
      title: '部位',
      dataIndex: 'species',
      sorter: (a, b) => (a.species > b.species ? -1 : 1),
      render: (dom) => {
        // eslint-disable-next-line array-callback-return
        return <Tag>{dom}</Tag>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      sorter: (a, b) => (a.createDate > b.createDate ? -1 : 1),
      valueType: 'dateTime',
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
        dataSource={tableListDataSource}
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
      {/* 列表详情 */}
      <DetailForm
        onCancel={{
          onClose: () => handleDetailModalVisible(false),
        }}
        onSubmit={async (value) => {
          const success = await handleDetail(value);
          if (success) {
            handleDetailModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        detailModalVisible={detailModalVisible}
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
