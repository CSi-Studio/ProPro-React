import { message, Tooltip, Form, Tag } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import type { DomainCell, Domain, DomainUpdate } from './data';
import type { Pagination } from '@/components/Commons/common';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { Icon } from '@iconify/react';
import { update, add, list, removeList } from './service';
import DeleteForm from './components/DeleteForm';

/**
 * 添加库
 * @param values
 */
const handleAdd = async (values: Domain) => {
  const hide = message.loading('正在添加');
  try {
    await add({ ...values });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    return false;
  }
};
/**
 * 更新库
 * @param values
 */
const handleUpdate = async (values: DomainUpdate) => {
  const hide = message.loading('正在更新');
  try {
    await update({ ...values });
    hide();
    message.success('编辑成功');
    return true;
  } catch (error) {
    hide();
    return false;
  }
};
/**
 * 删除库
 * @param selectedRowsState
 */
const handleRemove = async (selectedRowsState: any[]) => {
  try {
    await removeList({
      methodIds: selectedRowsState[0].id,
    });
    message.success('删除成功，希望你不要后悔 🥳');
    return true;
  } catch (error) {
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList: React.FC = () => {
  const [formCreate] = Form.useForm();
  const [formUpdate] = Form.useForm();
  const [formDelete] = Form.useForm();
  // /** 全选 */
  const [selectedRowsState, setSelectedRows] = useState<any[]>([]);
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 更新窗口的弹窗 */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  /** 删除窗口的弹窗 */
  const [deleteModalVisible, handleDeleteModalVisible] = useState<boolean>(false);

  const [total, setTotal] = useState<any>();
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<DomainCell>();
  const columns: ProColumns<DomainCell>[] = [
    {
      title: '方法包名称',
      dataIndex: 'name',
    },
    {
      title: '描述信息',
      dataIndex: 'description',
      hideInSearch: true,
      valueType: 'textarea',
      render: (dom, entity) => {
        if (
          entity.description === 'undefined' ||
          entity.description == null ||
          entity.description === ''
        ) {
          return (
            <Tooltip title="" color="#108ee9" placement="topLeft">
              <p
                style={{
                  margin: 0,
                  width: '300px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                <span></span>
              </p>
            </Tooltip>
          );
        }
        return (
          <Tooltip title={entity.description} color="#108ee9" placement="topLeft">
            <p
              style={{
                margin: 0,
                width: '200px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              <span>{entity.description}</span>
            </p>
          </Tooltip>
        );
      },
    },
    {
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      hideInSearch: true,
      render: (text, record) => [
        <Tooltip title={'编辑'} key="edit">
          <a
            onClick={() => {
              formUpdate?.resetFields();
              handleUpdateModalVisible(true);
              setCurrentRow(record);
            }}
            key="edit"
          >
            <Tag color="blue">
              <Icon style={{ verticalAlign: '-4px', fontSize: '16px' }} icon="mdi:file-edit" />
              编辑
            </Tag>
          </a>
        </Tooltip>,
      ],
    },
  ];
  return (
    <>
      <ProTable<DomainCell, Pagination>
        scroll={{ x: 'max-content' }}
        headerTitle="方法列表"
        search={{ labelWidth: 'auto' }}
        actionRef={actionRef}
        rowKey="id"
        size="small"
        tableAlertRender={false}
        toolBarRender={() => [
          <Tooltip title={'新增'} key="add">
            <a>
              <Tag
                color="green"
                onClick={() => {
                  formCreate?.resetFields();
                  handleModalVisible(true);
                }}
              >
                <Icon
                  style={{ verticalAlign: 'middle', fontSize: '20px' }}
                  icon="mdi:playlist-plus"
                />
                新增
              </Tag>
            </a>
          </Tooltip>,
          <Tooltip placement="top" title={'删除'} key="delete">
            <a
              key="delete"
              onClick={async () => {
                formDelete?.resetFields();
                if (selectedRowsState?.length > 0) {
                  if (selectedRowsState.length == 1) {
                    handleDeleteModalVisible(true);
                  } else {
                    message.warn('目前只支持单个库的删除');
                    setSelectedRows([]);
                  }
                } else {
                  message.warn('请选择要删除的库');
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
          selectedRowKeys: selectedRowsState?.map((item) => {
            return item.id;
          }),
          onChange: (_, selectedRowKeys) => {
            setSelectedRows(selectedRowKeys);
          },
        }}
      />

      {/* 新建列表 */}
      <CreateForm
        form={formCreate}
        onCancel={() => {
          handleModalVisible(false);
          formCreate?.resetFields();
        }}
        onSubmit={async (value: Domain) => {
          const success = await handleAdd(value);
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
        form={formUpdate}
        onCancel={() => {
          handleUpdateModalVisible(false);
          setCurrentRow(undefined);
          formUpdate?.resetFields();
        }}
        onSubmit={async (value) => {
          // eslint-disable-next-line no-param-reassign
          value.id = currentRow?.id as string;
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
        selectedRowsState={selectedRowsState}
        form={formDelete}
        onCancel={() => {
          handleDeleteModalVisible(false);
          setSelectedRows([]);
          formDelete?.resetFields();
        }}
        onSubmit={async (value) => {
          if (value.name === selectedRowsState[0]?.name) {
            const success = await handleRemove(selectedRowsState);
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
