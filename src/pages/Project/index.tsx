import { Icon } from '@iconify/react';
import { Button, Form, message, Tag, Tooltip } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { TableDropdown } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {
  addList,
  peptideScan,
  projectList,
  removeAna,
  removeIrt,
  removeList,
  updateList,
} from './service';
import type { TableListItem, TableListPagination } from './data';
import type { addFormValueType } from './components/CreateForm';
import CreateForm from './components/CreateForm';
import DetailForm from './components/DetailForm';
import type { updateFormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import DeleteForm from './components/DeleteForm';
import './index.less';

/**
 * 添加库
 * @param values
 */
const handleAdd = async (values: addFormValueType) => {
  const hide = message.loading('正在添加');
  try {
    await addList({ ...values });
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
 * 更新库
 * @param values
 */
const handleUpdate = async (values: updateFormValueType) => {
  const hide = message.loading('正在更新');
  try {
    await updateList({ ...values });
    hide();
    message.success('编辑成功');
    return true;
  } catch (error) {
    hide();
    message.error('编辑失败，请重试!');
    return false;
  }
};
/**
 * 扫描库
 * @param values
 */
const handleScan = async (values: { projectId: string }) => {
  const hide = message.loading('正在扫描');
  try {
    await peptideScan({ ...values });
    hide();
    message.success('扫描更新成功');
    return true;
  } catch (error) {
    hide();
    return false;
  }
};

/**
 * 删除库
 * @param currentRow
 */
const handleRemove = async (currentRow: TableListItem | undefined) => {
  if (!currentRow) return true;
  const hide = message.loading('正在扫描');
  try {
    await removeList({
      projectId: currentRow.id,
    });
    hide();

    message.success('删除成功，希望你不要后悔 🥳');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};
/**
 * 删除分析结果
 * @param projectId
 */
const handleRmAna = async (values: { projectId: string }) => {
  const hide = message.loading('正在扫描');
  try {
    await removeAna({ ...values });
    hide();
    message.success('删除分析结果成功，希望你不要后悔 🥳');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};
/**
 * 删除IRT
 * @param currentRow
 */
const handleRmIrt = async (values: { projectId: string }) => {
  const hide = message.loading('正在扫描');
  try {
    await removeIrt({ ...values });
    hide();
    message.success('删除IRT成功，希望你不要后悔 🥳');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList: React.FC = () => {
  const [formCreate] = Form.useForm();
  const [formUpdate] = Form.useForm();
  const [formDelete] = Form.useForm();
  /** 全局弹窗 */
  // const [popup, setPopup] = useState<boolean>(false);
  /** 全选 */
  // const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>();
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 删除窗口的弹窗 */
  const [deleteModalVisible, handleDeleteModalVisible] = useState<boolean>(false);
  /** 更新窗口的弹窗 */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  /** 库详情的抽屉 */
  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '项目名称',
      dataIndex: 'name',
      render: (dom, record) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(record);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '项目别名',
      dataIndex: 'alias',
      render: (dom) => {
        return <a>{dom}</a>;
      },
    },
    {
      title: '实验类型',
      dataIndex: 'type',
    },
    {
      title: '负责人',
      dataIndex: 'owner',
    },
    {
      title: '标准库',
      dataIndex: 'anaLibName',
    },
    {
      title: '内标库',
      dataIndex: 'insLibName',
    },
    {
      title: '标签',
      dataIndex: 'tags',
      render: (dom) => {
        // eslint-disable-next-line array-callback-return
        return <Tag>{dom}</Tag>;
      },
    },
    {
      title: '项目描述',
      dataIndex: 'description',
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
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
        <Tooltip title={'编辑'}>
          <a
            onClick={() => {
              formUpdate?.resetFields();
              handleUpdateModalVisible(true);
              setCurrentRow(record);
            }}
          >
            <Icon style={{ verticalAlign: 'middle', fontSize: '20px' }} icon="mdi:file-edit" />
          </a>
        </Tooltip>,
        <Tooltip title={'详情'}>
          <a
            onClick={() => {
              setCurrentRow(record);
              setShowDetail(true);
            }}
          >
            <Icon style={{ verticalAlign: 'middle', fontSize: '20px' }} icon="mdi:file-document" />
          </a>
        </Tooltip>,
        <Tooltip title={'扫描并更新'}>
          <a
            onClick={() => {
              handleScan({ projectId: record.id });
            }}
          >
            <Icon style={{ verticalAlign: 'middle', fontSize: '20px' }} icon="mdi:file-search" />
          </a>
        </Tooltip>,
        <Tooltip title={'删除分析结果'}>
          <a
            onClick={() => {
              handleRmAna({ projectId: record.id });
            }}
          >
            <Icon style={{ verticalAlign: 'middle', fontSize: '20px' }} icon="mdi:delete-sweep" />
          </a>
        </Tooltip>,
        <Tooltip title={'删除IRT'}>
          <a
            onClick={() => {
              handleRmIrt({ projectId: record.id });
            }}
          >
            <Icon
              style={{ verticalAlign: 'middle', fontSize: '20px' }}
              icon="mdi:delete-sweep-outline"
            />
          </a>
        </Tooltip>,
        <Tooltip title={'批量IRT计算'}>
          <a href={'https://commands.top'} target="_blank" rel="noopener noreferrer">
            <Icon style={{ verticalAlign: 'middle', fontSize: '20px' }} icon="mdi:calculator" />
          </a>
        </Tooltip>,
        <Tooltip title={'批量执行完整流程'}>
          <a href={'https://commands.top'} target="_blank" rel="noopener noreferrer">
            <Icon style={{ verticalAlign: 'middle', fontSize: '20px' }} icon="mdi:connection" />
          </a>
        </Tooltip>,
        <TableDropdown
          onSelect={(key) => {
            // eslint-disable-next-line no-console
            console.log(key);
            if (key === 'check') {
              message.success('我是查看结果总览');
            }
            if (key === 'export') {
              message.success('我是导出');
            }
            if (key === 'delete') {
              message.success('我是删除');
              formDelete?.resetFields();
              handleDeleteModalVisible(true);
              setCurrentRow(record);
            }
          }}
          menus={[
            {
              key: 'check',
              name: '查看结果总览',
              icon: (
                <Icon
                  style={{ verticalAlign: 'middle', fontSize: '20px', color: '#0D93F7' }}
                  icon="mdi:file-eye"
                />
              ),
            },
            {
              key: 'export',
              name: '导出',
              icon: (
                <Icon
                  style={{ verticalAlign: 'middle', fontSize: '20px', color: '#0D93F7' }}
                  icon="mdi:file-export"
                />
              ),
            },
            {
              key: 'delete',
              name: '删除',
              icon: (
                <Icon
                  style={{ verticalAlign: 'middle', fontSize: '20px', color: '#0D93F7' }}
                  icon="mdi:delete"
                />
              ),
            },
          ]}
        />,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        scroll={{ x: 'max-content' }}
        headerTitle={''}
        actionRef={actionRef}
        rowKey="id"
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
            <Icon style={{ verticalAlign: 'middle', fontSize: '20px' }} icon="mdi:playlist-plus" />{' '}
            创建项目
          </Button>,
        ]}
        request={projectList}
        // dataSource={tableListDataSource}
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
              </a>
              项 &nbsp;&nbsp;
            </div>
          }
        ></FooterToolbar>
      )}
      {/* 新建列表 */}
      <CreateForm
        form={formCreate}
        onCancel={{
          onCancel: () => {
            handleModalVisible(false);
            formCreate?.resetFields();
          },
        }}
        onSubmit={async (value: addFormValueType) => {
          // eslint-disable-next-line no-console
          console.log(value);
          const success = await handleAdd(value as addFormValueType);
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
        showDetail={showDetail}
        currentRow={currentRow}
        columns={columns}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
      />

      {/* 编辑列表 */}
      <UpdateForm
        form={formUpdate}
        onCancel={{
          onCancel: () => {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);
            formUpdate?.resetFields();
          },
        }}
        onSubmit={async (value) => {
          // eslint-disable-next-line no-param-reassign
          value.id = currentRow?.id as unknown as string;
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
        currentRow={currentRow}
        form={formDelete}
        onCancel={{
          onCancel: () => {
            handleDeleteModalVisible(false);
            setCurrentRow(undefined);
            formDelete?.resetFields();
          },
        }}
        onSubmit={async (value) => {
          if (value.name === currentRow?.name) {
            const success = await handleRemove(currentRow);
            if (success) {
              handleDeleteModalVisible(false);
              setCurrentRow(undefined);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          } else {
            message.error('你没有删除的决心，给👴🏻 爬');
          }
        }}
        deleteModalVisible={deleteModalVisible}
        values={currentRow || {}}
      />
    </PageContainer>
  );
};

export default TableList;
