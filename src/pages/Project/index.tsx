import { Icon } from '@iconify/react';
import { Form, message, Tag, Tooltip, Space, Dropdown, Menu } from 'antd';
import React, { useState, useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {
  addList,
  peptideScan,
  projectList,
  removeIrt,
  removeList,
  removeRes,
  updateList,
} from './service';
import type { TableListItem, TableListPagination } from './data';
import type { addFormValueType } from './components/CreateForm';
import CreateForm from './components/CreateForm';
import DetailForm from './components/DetailForm';
import type { updateFormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import DeleteForm from './components/DeleteForm';
import DeleteIrt from './components/DeleteIrt';
import { Link } from 'umi';
import DeleteRes from './components/DeleteRes';
import { getDict } from '../Dict/service';

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
const handleRmRes = async (row: TableListItem | undefined) => {
  if (!row) return true;
  const hide = message.loading('正在扫描');
  try {
    await removeRes({ projectId: row.id });
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

const data = await getDict();
data.data.map((item: any, index: string) => {
  sessionStorage.setItem(item.name, JSON.stringify(item.item));
});

const TableList: React.FC = () => {
  const [formCreate] = Form.useForm();
  const [formUpdate] = Form.useForm();
  const [formDelete] = Form.useForm();
  const [formDeleteRes] = Form.useForm();
  const [formDeleteIrt] = Form.useForm();

  /** 多选 */
  const [selectedRows, setSelectedRows] = useState<TableListItem[]>([]);
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
  /** 分页相关 */
  const [total, setTotal] = useState<any>();

  const actionRef = useRef<ActionType>();
  /** 当选当前行  */
  const [currentRow, setCurrentRow] = useState<TableListItem>();

  const columns: ProColumns<TableListItem>[] = [
    {
      key: 'name',
      title: '项目名',
      dataIndex: 'name',
      render: (dom, record) => {
        return (
          <Tooltip title={'Id:' + record.id} placement="topLeft">
            <a
              onClick={() => {
                setCurrentRow(record);
                setShowDetail(true);
              }}
            >
              {dom}
            </a>
          </Tooltip>
        );
      },
    },
    {
      title: 'ProjectId',
      dataIndex: 'id',
      hideInTable: true,
      render: (dom) => {
        return <Tag>{dom}</Tag>;
      },
    },
    {
      key: 'alias',
      title: '别名',
      dataIndex: 'alias',
      render: (dom, entity) => {
        if (entity.alias) {
          return <Tag>{dom}</Tag>;
        }
        return false;
      },
    },
    {
      key: 'expCount',
      title: '实验数',
      dataIndex: 'expCount',
      hideInSearch: true,
      render: (dom, entity) => {
        return (
          <>
            {dom === 0 ? <Tag color="red">{dom}</Tag> : <Tag color="blue">{dom}</Tag>}
            {dom !== 0 ? (
              <Link
                style={{
                  margin: 0,
                  width: '200px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                to={{
                  pathname: '/experiment/list',
                  state: { projectName: entity.name },
                  search: `?projectId=${entity.id}`,
                }}
              >
                <Tag color="green">查看</Tag>
              </Link>
            ) : null}
          </>
        );
      },
    },
    {
      key: 'overviewCount',
      title: '分析数',
      dataIndex: 'overviewCount',
      hideInSearch: true,
      render: (dom, entity) => {
        return (
          <>
            {dom === 0 ? <Tag color="red">{dom}</Tag> : <Tag color="blue">{dom}</Tag>}
            {dom !== 0 ? (
              <Link
                to={{
                  pathname: '/overview',
                  search: `?projectId=${entity.id}`,
                  state: { projectName: entity.name },
                }}
              >
                <Tag color="green">查看</Tag>
              </Link>
            ) : null}
          </>
        );
      },
    },
    {
      key: 'type',
      title: '类型',
      dataIndex: 'type',
      hideInSearch: true,
    },
    {
      key: 'owner',
      title: '负责人',
      dataIndex: 'owner',
    },
    {
      key: 'insLibName',
      title: '内标库',
      dataIndex: 'insLibName',
      hideInSearch: true,
      render: (dom, entity) => {
        if (dom === '-') {
          return <Tag color="red">未设置</Tag>;
        } else {
          return (
            <Tooltip title={dom}>
              <Link to={{ pathname: '/peptide/list', search: `?libraryId=${entity.insLibId}` }}>
                <Tag color="blue">{entity.insLibName}</Tag>
              </Link>
            </Tooltip>
          );
        }
      },
    },
    {
      key: 'anaLibName',
      title: '标准库',
      dataIndex: 'anaLibName',
      hideInSearch: true,
      render: (dom, entity) => {
        if (dom === '-') {
          return <Tag color="red">未设置</Tag>;
        } else {
          return (
            <Tooltip title={dom}>
              <Link to={{ pathname: '/peptide/list', search: `?libraryId=${entity.anaLibId}` }}>
                <Tag color="blue">{entity.anaLibName}</Tag>
              </Link>
            </Tooltip>
          );
        }
      },
    },
    {
      key: 'methodName',
      title: '方法包',
      dataIndex: 'methodName',
      hideInSearch: true,
      render: (dom, entity) => {
        if (dom === '-') {
          return <Tag color="red">未设置</Tag>;
        } else {
          return (
            <Tooltip title={dom}>
              <Link
                to={{
                  pathname: '/method/list',
                  search: `?id=${entity.methodId}`,
                  state: { projectName: entity.name },
                }}
              >
                <Tag color="blue">{entity.methodName}</Tag>
              </Link>
            </Tooltip>
          );
        }
      },
    },
    {
      key: 'tags',
      title: '标签',
      dataIndex: 'tags',
      hideInSearch: true,
      render: (text, entity) => {
        if (entity.tags && entity.tags.length !== 0) {
          let tagsDom: any[] = [];
          entity.tags.forEach((tag) => {
            tagsDom.push([<Tag key={tag}>{tag}</Tag>]);
          });
          return <>{tagsDom}</>;
        }
        return false;
      },
    },

    {
      key: 'createDate',
      title: '创建时间',
      dataIndex: 'createDate',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      key: 'option',
      title: '操作',
      valueType: 'option',
      copyable: true,
      width: 100,
      ellipsis: true,
      fixed: 'right',
      hideInSearch: true,
      render: (text, record) => (
        <Space>
          <Tooltip title={'编辑'}>
            <a
              onClick={() => {
                formUpdate?.resetFields();
                handleUpdateModalVisible(true);
                setCurrentRow(record);
              }}
            >
              <Tag color="blue">
                <Icon style={{ verticalAlign: '-5px', fontSize: '18px' }} icon="mdi:file-edit" />
                编辑
              </Tag>
            </a>
          </Tooltip>
          <Tooltip title={'详情'}>
            <a
              onClick={() => {
                setCurrentRow(record);
                setShowDetail(true);
              }}
            >
              <Tag color="blue">
                <Icon
                  style={{ verticalAlign: '-5px', fontSize: '18px' }}
                  icon="mdi:file-document"
                />
                详情
              </Tag>
            </a>
          </Tooltip>
          <Tooltip title={'开始分析'}>
            <Link
              to={{
                pathname: '/experiment/list',
                search: `?projectId=${record.id}`,
                state: { projectName: record.name },
              }}
            >
              <Tag color="blue">
                <Icon style={{ verticalAlign: '-5px', fontSize: '18px' }} icon="mdi:calculator" />
                分析
              </Tag>
            </Link>
          </Tooltip>
          
        </Space>
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
      <ProTable<TableListItem, TableListPagination>
        scroll={{ x: 'max-content' }}
        headerTitle="项目列表"
        actionRef={actionRef}
        rowKey="id"
        size="small"
        toolBarRender={() => [
          <Tooltip title="蛋白诊所" key="clinic">
            {selectedRows && selectedRows.length === 1 ? (
              <Link
                to={{
                  pathname: '/clinic',
                  search: `?projectId=${selectedRows[0].id}`,
                }}
              >
                <Tag color="blue">
                  <Icon
                    style={{ verticalAlign: '-4px', fontSize: '16px' }}
                    icon="mdi:stethoscope"
                  />
                  蛋白诊所
                </Tag>
              </Link>
            ) : (
              <a
                onClick={() => {
                  message.warn('请选且只选择一个项目');
                }}
              >
                <Tag color="blue">
                  <Icon
                    style={{ verticalAlign: '-4px', fontSize: '16px' }}
                    icon="mdi:stethoscope"
                  />
                  蛋白诊所
                </Tag>
              </a>
            )}
          </Tooltip>,
          <Tooltip title={'新增'} key="add">
            <a>
              <Tag
                color="green"
                onClick={() => {
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
          <Tooltip title={'扫描并更新'} key="scan">
            <a
              onClick={() => {
                if (selectedRows?.length > 0) {
                  if (selectedRows.length == 1) {
                    handleScan({ projectId: selectedRows[0].id });
                  } else {
                    message.warn('目前只支持单个项目的扫描');
                    setSelectedRows([]);
                  }
                } else {
                  message.warn('请选择要扫描的项目');
                }
              }}
            >
              <Tag color="blue">
                <Icon style={{ verticalAlign: '-4px', fontSize: '16px' }} icon="mdi:file-search" />
                扫描并更新
              </Tag>
            </a>
          </Tooltip>,
          <Tooltip title={'导出'} key="export">
            <a
              onClick={() => {
                if (selectedRows?.length > 0) {
                  if (selectedRows.length == 1) {
                    message.success('我是导出');
                    // handleScan({ projectId: selectedRows[0].id });
                  } else {
                    message.warn('目前只支持单个项目的导出');
                    setSelectedRows([]);
                  }
                } else {
                  message.warn('请选择要导出的项目');
                }
              }}
            >
              <Tag color="blue">
                <Icon style={{ verticalAlign: '-4px', fontSize: '16px' }} icon="mdi:file-export" />
                导出
              </Tag>
            </a>
          </Tooltip>,
          <Dropdown
            key="delete"
            overlay={
              <Menu>
                <Menu.Item key="1">
                  <Tooltip placement="left" title={'删除分析结果'}>
                    <a
                      key="deleteRes"
                      onClick={() => {
                        if (selectedRows?.length > 0) {
                          if (selectedRows.length == 1) {
                            formDeleteRes?.resetFields();
                            handleDelete1ModalVisible(true);
                          }
                          if (selectedRows.length > 1) {
                            message.warn('目前只支持单个项目的删除');
                            setSelectedRows([]);
                          }
                        } else {
                          message.warn('请先选择一个项目');
                        }
                      }}
                    >
                      <Tag color="error">
                        <Icon
                          style={{ verticalAlign: '-5px', fontSize: '18px' }}
                          icon="mdi:delete-sweep"
                        />
                        删除分析结果
                      </Tag>
                    </a>
                  </Tooltip>
                </Menu.Item>
                <Menu.Item key="2">
                  <Tooltip placement="left" title={'删除IRT'}>
                    <a
                      key="deleteIrt"
                      onClick={() => {
                        if (selectedRows?.length > 0) {
                          if (selectedRows.length == 1) {
                            formDeleteIrt?.resetFields();
                            handleDelete2ModalVisible(true);
                          }
                          if (selectedRows.length > 1) {
                            message.warn('目前只支持单个项目的删除');
                            setSelectedRows([]);
                          }
                        } else {
                          message.warn('请先选择一个项目');
                        }
                      }}
                    >
                      <Tag color="error">
                        <Icon
                          style={{ verticalAlign: '-5px', fontSize: '18px' }}
                          icon="mdi:delete-sweep-outline"
                        />
                        删除IRT
                      </Tag>
                    </a>
                  </Tooltip>
                </Menu.Item>
                <Menu.Item key="3">
                  <Tooltip placement="left" title={'删除项目'}>
                    <a
                      key="deletePjc"
                      onClick={() => {
                        if (selectedRows?.length > 0) {
                          if (selectedRows.length == 1) {
                            formDelete?.resetFields();
                            handleDeleteModalVisible(true);
                          }
                          if (selectedRows.length > 1) {
                            message.warn('目前只支持单个项目的删除');
                            setSelectedRows([]);
                          }
                        } else {
                          message.warn('请先选择一个项目');
                        }
                      }}
                    >
                      <Tag color="error">
                        <Icon
                          style={{ verticalAlign: '-5px', fontSize: '18px' }}
                          icon="mdi:delete"
                        />
                        删除项目
                      </Tag>
                    </a>
                  </Tooltip>
                </Menu.Item>
              </Menu>
            }
          >
            <Tooltip title={'删除'} key="delete">
              <Tag color="error">
                <Icon style={{ verticalAlign: '-5px', fontSize: '18px' }} icon="mdi:delete" />
                删除
              </Tag>
            </Tooltip>
          </Dropdown>,
        ]}
        tableAlertRender={false}
        pagination={{
          total: total,
        }}
        request={async (params) => {
          const msg = await projectList({ ...params });
          setTotal(msg.totalNum);
          return Promise.resolve(msg);
        }}
        columns={columns}
        onRow={(record, index) => {
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
      {/* <DetailForm
        showDetail={showDetail}
        currentRow={currentRow}
        columns={columns}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
      /> */}

      {/* 编辑列表 */}
      <UpdateForm
        form={formUpdate}
        onCancel={() => {
          handleUpdateModalVisible(false);
          setCurrentRow(undefined);
          formUpdate?.resetFields();
        }}
        onSubmit={async (value) => {
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
        currentRow={selectedRows[0]}
        form={formDelete}
        onCancel={() => {
          handleDeleteModalVisible(false);
          setSelectedRows([]);
          formDelete?.resetFields();
        }}
        onSubmit={async (value) => {
          if (value.name === selectedRows[0]?.name) {
            const success = await handleRemove(selectedRows[0]);
            if (success) {
              handleDeleteModalVisible(false);
              setSelectedRows([]);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          } else {
            message.error('你没有删除的决心');
          }
        }}
        deleteModalVisible={deleteModalVisible}
        values={selectedRows[0] || {}}
      />
      {/* 删除分析结果 */}
      <DeleteRes
        currentRow={selectedRows[0]}
        form={formDeleteRes}
        onCancel={() => {
          handleDelete1ModalVisible(false);
          setSelectedRows([]);
          formDeleteRes?.resetFields();
        }}
        onSubmit={async (value) => {
          if (value.name == '我要删除分析结果') {
            const success = await handleRmRes(selectedRows[0]);
            if (success) {
              handleDelete1ModalVisible(false);
              setSelectedRows([]);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          } else {
            message.error('你没有删除的决心');
          }
        }}
        delete1ModalVisible={delete1ModalVisible}
        values={selectedRows[0] || {}}
      />
      {/* 删除IRT */}
      <DeleteIrt
        currentRow={selectedRows[0]}
        form={formDeleteIrt}
        onCancel={() => {
          handleDelete2ModalVisible(false);
          setSelectedRows([]);
          formDeleteIrt?.resetFields();
        }}
        onSubmit={async (value) => {
          if (value.name === '我要删除IRT') {
            const success = await handleRmIrt(selectedRows[0]);
            if (success) {
              handleDelete2ModalVisible(false);
              setSelectedRows([]);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          } else {
            message.error('你没有删除的决心');
          }
        }}
        delete2ModalVisible={delete2ModalVisible}
        values={selectedRows[0] || {}}
      />
    </>
  );
};

export default TableList;
