import { message, Tooltip, Form, Tag, Typography } from 'antd';
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
import { Link, useIntl } from 'umi';

const { Text } = Typography;
const TableList: React.FC = (props: Record<string, any>) => {
  const intl = useIntl();

  /**
   * 添加库
   * @param values
   */
  const handleAdd = async (values: Domain) => {
    const hide = message.loading(
      `${intl.formatMessage({
        id: 'message.adding',
        defaultMessage: '正在添加...',
      })}`,
    );
    try {
      await add({ ...values });
      hide();
      message.success(
        `${intl.formatMessage({
          id: 'message.addSuccess',
          defaultMessage: '添加成功！',
        })}`,
      );
      return true;
    } catch (error) {
      hide();
      message.error(
        `${intl.formatMessage({
          id: 'message.addFail',
          defaultMessage: '添加失败，请重试！',
        })}`,
      );
      return false;
    }
  };
  /**
   * 更新库
   * @param values
   */
  const handleUpdate = async (values: DomainUpdate) => {
    const hide = message.loading(
      `${intl.formatMessage({
        id: 'message.updating',
        defaultMessage: '正在更新...',
      })}`,
    );
    try {
      await update({ ...values });
      hide();
      message.success(
        `${intl.formatMessage({
          id: 'message.editSuccess',
          defaultMessage: '编辑成功！',
        })}`,
      );
      return true;
    } catch (error) {
      hide();
      return false;
    }
  };
  /**
   * 删除库
   * @param selectedRows
   */
  const handleRemove = async (selectedRows: any[]) => {
    const methodIds = selectedRows.map((item) => {
      return item.id;
    });
    const hide = message.loading(
      `${intl.formatMessage({
        id: 'message.deleting',
        defaultMessage: '正在删除...',
      })}`,
    );
    try {
      await removeList({
        methodIds,
      });
      hide();
      message.success(
        `${intl.formatMessage({
          id: 'message.deleteSuccess',
          defaultMessage: '删除成功！',
        })}`,
      );
      return true;
    } catch (error) {
      message.error(
        `${intl.formatMessage({
          id: 'message.deleteFail',
          defaultMessage: '删除失败，请重试！',
        })}`,
      );
      return false;
    }
  };

  const [formCreate] = Form.useForm();
  const [formUpdate] = Form.useForm();
  const [formDelete] = Form.useForm();
  // /** 全选 */
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
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
      title: '分类器',
      dataIndex: 'algorithm',
      render: (dom, entity) => {
        return <Tag>{entity.classifier.algorithm}</Tag>;
      },
    },
    {
      title: 'mzWindow',
      dataIndex: 'mzWindow',
      render: (dom, entity) => {
        return <Tag>{entity.eic.mzWindow} ppm</Tag>;
      },
    },
    {
      title: 'rtWindow',
      dataIndex: 'rtWindow',
      render: (dom, entity) => {
        return <Tag>{entity.eic.rtWindow}</Tag>;
      },
    },
    {
      title: '选峰算法',
      dataIndex: 'peakFindingMethod',
      render: (dom, entity) => {
        return <Tag>{entity.peakFinding.peakFindingMethod}</Tag>;
      },
    },
    {
      title: 'fdr',
      dataIndex: 'fdr',
      render: (dom, entity) => {
        return <Tag>{entity.classifier.fdr}</Tag>;
      },
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
      render: (text, record) => (
        <>
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
        </>
      ),
    },
  ];
  /* 点击行选中相关 */
  const selectRow = (record: any) => {
    const rowData = [...selectedRows];
    if (rowData.length == 0) {
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
      <ProTable<DomainCell, Pagination>
        scroll={{ x: 'max-content' }}
        headerTitle={
          props?.location?.state?.projectName === undefined ? (
            <>
              <Text>方法列表</Text>
            </>
          ) : (
            <>
              <Link
                to={{
                  pathname: '/project/list',
                }}
              >
                <Text type="secondary">方法列表</Text>
              </Link>
              &nbsp;&nbsp;/&nbsp;&nbsp;
              <a>
                <Text>方法列表 所属项目：{props?.location?.state?.projectName}</Text>
              </a>
            </>
          )
        }
        search={{ labelWidth: 'auto' }}
        actionRef={actionRef}
        rowKey="id"
        size="small"
        tableAlertRender={false}
        toolBarRender={() => [
          <a key="add">
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
          </a>,
          <a
            key="delete"
            onClick={async () => {
              formDelete?.resetFields();
              if (selectedRows?.length > 0) {
                handleDeleteModalVisible(true);
              } else {
                message.warn('请选择要删除的方法');
              }
            }}
          >
            <Tag color="error">
              <Icon style={{ verticalAlign: '-4px', fontSize: '16px' }} icon="mdi:delete" />
              删除
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
        selectedRows={selectedRows}
        form={formDelete}
        onCancel={() => {
          handleDeleteModalVisible(false);
          setSelectedRows([]);
          formDelete?.resetFields();
        }}
        onSubmit={async (value) => {
          if (value.name === 'ok') {
            const success = await handleRemove(selectedRows);
            if (success) {
              handleDeleteModalVisible(false);
              setSelectedRows([]);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          } else {
            message.error(
              `${intl.formatMessage({
                id: 'message.deleteInputFail',
                defaultMessage: '输入错误，请重新输入！',
              })}`,
            );
          }
        }}
        deleteModalVisible={deleteModalVisible}
      />
    </>
  );
};

export default TableList;
