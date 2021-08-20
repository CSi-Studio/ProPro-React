import { Button, message, Tooltip, Form } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import type { DomainCell, Domain, DomainUpdate } from './data';
import type { Pagination } from '@/components/Commons/common';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { Icon } from '@iconify/react';
import { update, add, list } from './service';

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

const TableList: React.FC = () => {
  const [formCreate] = Form.useForm();
  const [formUpdate] = Form.useForm();
  // const [formDelete] = Form.useForm();
  // const [formClone] = Form.useForm();
  /** 全局弹窗 */
  // const [popup, setPopup] = useState<boolean>(false);
  /** 全选 */
  // const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>();
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);

  /** 更新窗口的弹窗 */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

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
              // setPopup(true);
            }}
            key="edit"
          >
            <Icon style={{ verticalAlign: 'middle', fontSize: '20px' }} icon="mdi:file-edit" />
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
<<<<<<< HEAD
        tableAlertRender={false}
=======
>>>>>>> cb8304f11deaceeb22b91c307dfd6a9b95325c12
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              formCreate?.resetFields();
              handleModalVisible(true);
            }}
          >
            <Icon style={{ verticalAlign: 'middle', fontSize: '20px' }} icon="mdi:playlist-plus" />
            创建库
          </Button>,
        ]}
        request={list}
        columns={columns}
        rowSelection={
          {
            // onChange: (_, selectedRows) => {
            // setSelectedRows(selectedRows);
            // },
          }
        }
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
        onCancel={{
          onCancel: () => {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);
            formUpdate?.resetFields();
          },
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
    </>
  );
};

export default TableList;
