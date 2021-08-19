import { Icon } from '@iconify/react';
import { Button, Form, message, Tag, Tooltip, Space } from 'antd';
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
import DeleteAna from './components/DeleteAna';
import DeleteIrt from './components/DeleteIrt';
import { Link } from 'umi';

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
const handleRmAna = async (currentRow: TableListItem | undefined) => {
  if (!currentRow) return true;
  const hide = message.loading('正在扫描');
  try {
    await removeAna({ projectId: currentRow.id });
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
const handleRmIrt = async (currentRow: TableListItem | undefined) => {
  if (!currentRow) return true;
  const hide = message.loading('正在扫描');
  try {
    await removeIrt({ projectId: currentRow.id });
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
  /** 删除分析结果的弹窗 */
  const [delete1ModalVisible, handleDelete1ModalVisible] = useState<boolean>(false);
  /** 删除IRT的弹窗 */
  const [delete2ModalVisible, handleDelete2ModalVisible] = useState<boolean>(false);
  /** 更新窗口的弹窗 */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  /** 库详情的抽屉 */
  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);

  const columns: ProColumns<TableListItem>[] = [
    {
      key:'name',
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
      key:'alias',
      title: '项目别名',
      dataIndex: 'alias',
    },
    {
      key:'expCount',
      title: '实验个数',
      dataIndex: 'expCount',
      hideInSearch: true,
      render: (dom, entity) => {
        return <>
          <Tag color="blue">{dom}</Tag>
          <Link to={{ pathname: '/experiment/list', search: `?projectId=${entity.id}` }}>
            <Tag color="green">查看</Tag>
          </Link>
        </>
      },
    },
    {
      key:'type',
      title: '类型',
      dataIndex: 'type',
      hideInSearch: true,
    },
    {
      key:'owner',
      title: '负责人',
      dataIndex: 'owner',
    },
    {
      key:'anaLibName',
      title: '标准库',
      dataIndex: 'anaLibName',
      hideInSearch: true,
      render: (dom, entity) => {
        if(dom === '-'){
          return  <Tag color="red">未设置</Tag>
        } else {
          return <Tooltip title={dom}>
            <Link to={{ pathname: '/peptide/list', search: `?libraryId=${entity.anaLibId}` }}>
            <Tag color="blue">查看</Tag>
          </Link>
        </Tooltip>
        }
      },
    },
    {
      key:'insLibName',
      title: '内标库',
      dataIndex: 'insLibName',
      hideInSearch: true,
      render: (dom, entity) => {
        if(dom === '-'){
          return  <Tag color="red">未设置</Tag>
        } else {
          return <Tooltip title={dom}>
            <Link to={{ pathname: '/peptide/list', search: `?libraryId=${entity.insLibId}` }}>
            <Tag color="blue">查看</Tag>
          </Link>
        </Tooltip>
        }
      },
    },
    {
      key:'methodName',
      title: '方法包',
      dataIndex: 'methodName',
      hideInSearch: true,
      render: (dom, entity) => {
        if(dom === '-'){
          return  <Tag color="red">未设置</Tag>
        } else {
          return <Tooltip title={dom}>
            <Link to={{ pathname: '/method/list', search: `?id=${entity.methodId}` }}>
            <Tag color="blue">查看</Tag>
          </Link>
        </Tooltip>
        }
      },
    },
    {
      key:'tags',
      title: '标签',
      dataIndex: 'tags',
      hideInSearch: true,
      render: (dom, entity) => {
        if (entity.tags) {
          return <Tag>{dom}</Tag>;
        }
        return false;
      },
    },
    {
      key:'description',
      title: '项目描述',
      dataIndex: 'description',
      hideInSearch: true,
    },
    {
      key:'createDate',
      title: '创建时间',
      dataIndex: 'createDate',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      key:'option',
      title: '操作',
      valueType: 'option',
      copyable: true,
      width: 100,
      ellipsis: true,
      fixed: 'right',
      hideInSearch: true,
      render: (text, record) => 
        <Space>
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
        </Tooltip>
        <Tooltip title={'详情'}>
          <a
            onClick={() => {
              setCurrentRow(record);
              setShowDetail(true);
            }}
          >
            <Icon style={{ verticalAlign: 'middle', fontSize: '20px' }} icon="mdi:file-document" />
          </a>
        </Tooltip>
        <Tooltip title={'扫描并更新'}>
          <a
            onClick={() => {
              handleScan({ projectId: record.id });
            }}
          >
            <Icon style={{ verticalAlign: 'middle', fontSize: '20px' }} icon="mdi:file-search" />
          </a>
        </Tooltip>
        <Tooltip title={'查看结果总览'}>
          <a
            onClick={() => {
              message.success('我是查看结果总览');
            }}
          >
            <Icon
              style={{ verticalAlign: 'middle', fontSize: '20px', color: '#0D93F7' }}
              icon="mdi:file-eye"
            />
          </a>
        </Tooltip>
        <Tooltip title={'导出'}>
          <a
            onClick={() => {
              message.success('我是导出');
            }}
          >
            <Icon
              style={{ verticalAlign: 'middle', fontSize: '20px', color: '#0D93F7' }}
              icon="mdi:file-export"
            />
          </a>
        </Tooltip>
        <Tooltip title={'批量IRT计算'}>
          <a href={'https://commands.top'} target="_blank" rel="noopener noreferrer">
            <Icon style={{ verticalAlign: 'middle', fontSize: '20px' }} icon="mdi:calculator" />
          </a>
        </Tooltip>
        <Tooltip title={'批量执行完整流程'}>
          <a href={'https://commands.top'} target="_blank" rel="noopener noreferrer">
            <Icon style={{ verticalAlign: 'middle', fontSize: '20px' }} icon="mdi:connection" />
          </a>
        </Tooltip>
        <TableDropdown
          onSelect={(key) => {
            if (key === 'delete1') {
              message.success('我是删除分析结果');
              formDelete?.resetFields();
              handleDelete1ModalVisible(true);
              setCurrentRow(record);
            }
            if (key === 'delete2') {
              message.success('我是删除IRT');
              formDelete?.resetFields();
              handleDelete2ModalVisible(true);
              setCurrentRow(record);
            }
            if (key === 'delete3') {
              message.success('我是删除');
              formDelete?.resetFields();
              handleDeleteModalVisible(true);
              setCurrentRow(record);
            }
          }}
          menus={[
            {
              key: 'delete1',
              name: '删除分析结果',
              icon: (
                <Icon
                  style={{ verticalAlign: 'middle', fontSize: '20px', color: '#0D93F7' }}
                  icon="mdi:delete-sweep"
                />
              ),
            },
            {
              key: 'delete2',
              name: '删除IRT',
              icon: (
                <Icon style={{ verticalAlign: 'middle', fontSize: '20px', color: '#0D93F7' }} icon="mdi:delete-sweep-outline"/>
              ),
            },
            {
              key: 'delete3',
              name: '删除',
              icon: (
                <Icon style={{ verticalAlign: 'middle', fontSize: '20px', color: '#0D93F7' }} icon="mdi:delete"/>
              ),
            },
          ]}
        />
      </Space>,
    },
  ];
  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        scroll={{ x: 'max-content' }}
        headerTitle={''}
        actionRef={actionRef}
        rowKey="id"
        size="small"
        search={{
          labelWidth: 100,
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
            message.error('你没有删除的决心');
          }
        }}
        deleteModalVisible={deleteModalVisible}
        values={currentRow || {}}
      />
      {/* 删除分析结果 */}
      <DeleteAna
        currentRow={currentRow}
        form={formDelete}
        onCancel={{
          onCancel: () => {
            handleDelete1ModalVisible(false);
            setCurrentRow(undefined);
            formDelete?.resetFields();
          },
        }}
        onSubmit={async (value) => {
          if (value.name === currentRow?.name) {
            const success = await handleRmAna(currentRow);
            if (success) {
              handleDelete2ModalVisible(false);
              setCurrentRow(undefined);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          } else {
            message.error('你没有删除的决心');
          }
        }}
        delete1ModalVisible={delete1ModalVisible}
        values={currentRow || {}}
      />
      {/* 删除IRT */}
      <DeleteIrt
        currentRow={currentRow}
        form={formDelete}
        onCancel={{
          onCancel: () => {
            handleDelete2ModalVisible(false);
            setCurrentRow(undefined);
            formDelete?.resetFields();
          },
        }}
        onSubmit={async (value) => {
          if (value.name === currentRow?.name) {
            const success = await handleRmIrt(currentRow);
            if (success) {
              handleDelete2ModalVisible(false);
              setCurrentRow(undefined);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          } else {
            message.error('你没有删除的决心');
          }
        }}
        delete2ModalVisible={delete2ModalVisible}
        values={currentRow || {}}
      />
    </PageContainer>
  );
};

export default TableList;
