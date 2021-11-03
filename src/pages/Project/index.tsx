import { Icon } from '@iconify/react';
import { Form, message, Tag, Tooltip, Dropdown, Menu } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {
  addList,
  peptideScan,
  projectList,
  removeIrt,
  removeList,
  removeRes,
  report,
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
import { useIntl } from 'umi';

const TableList: React.FC = () => {
  const intl = useIntl();

  /**
   * 添加库
   * @param values
   */
  const handleAdd = async (values: addFormValueType) => {
    const hide = message.loading(
      `${intl.formatMessage({
        id: 'message.adding',
        defaultMessage: '正在添加...',
      })}`,
    );
    try {
      await addList({ ...values });
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
  const handleUpdate = async (values: updateFormValueType) => {
    const hide = message.loading(
      `${intl.formatMessage({
        id: 'message.updating',
        defaultMessage: '正在更新...',
      })}`,
    );
    try {
      await updateList({ ...values });
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
      message.error(
        `${intl.formatMessage({
          id: 'message.editFail',
          defaultMessage: '编辑失败，请重试！',
        })}`,
      );
      return false;
    }
  };

  /**
   * 扫描库
   * @param values
   */
  const handleScan = async (values: { projectId: string }) => {
    const hide = message.loading(
      `${intl.formatMessage({
        id: 'message.scanning',
        defaultMessage: '正在扫描...',
      })}`,
    );
    try {
      await peptideScan({ ...values });
      hide();
      message.success(
        `${intl.formatMessage({
          id: 'message.scanSuccess',
          defaultMessage: '扫描并更新成功！',
        })}`,
      );
      return true;
    } catch (error) {
      hide();
      message.error(
        `${intl.formatMessage({
          id: 'message.scanFail',
          defaultMessage: '扫描失败，请重试！',
        })}`,
      );
      return false;
    }
  };

  /**
   * 删除库
   * @param currentRow
   */
  const handleRemove = async (currentRow: TableListItem | undefined) => {
    if (!currentRow) return true;
    const hide = message.loading(
      `${intl.formatMessage({
        id: 'message.deleting',
        defaultMessage: '正在删除...',
      })}`,
    );
    try {
      await removeList({
        projectId: currentRow.id,
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
      hide();
      message.error(
        `${intl.formatMessage({
          id: 'message.deleteFail',
          defaultMessage: '删除失败，请重试！',
        })}`,
      );
      return false;
    }
  };

  /**
   * 删除分析结果
   * @param projectId
   */
  const handleRmRes = async (row: TableListItem | undefined) => {
    if (!row) return true;
    const hide = message.loading(
      `${intl.formatMessage({
        id: 'message.deleting',
        defaultMessage: '正在删除...',
      })}`,
    );
    try {
      await removeRes({ projectId: row.id });
      hide();
      message.success(
        `${intl.formatMessage({
          id: 'message.deleteAnaSuccess',
          defaultMessage: '删除分析结果成功！',
        })}`,
      );
      return true;
    } catch (error) {
      hide();
      message.error(
        `${intl.formatMessage({
          id: 'message.deleteFail',
          defaultMessage: '删除失败，请重试！',
        })}`,
      );
      return false;
    }
  };

  /**
   * 删除IRT
   * @param currentRow
   */
  const handleRmIrt = async (currentRow: TableListItem | undefined) => {
    if (!currentRow) return true;
    const hide = message.loading(
      `${intl.formatMessage({
        id: 'message.deleting',
        defaultMessage: '正在删除...',
      })}`,
    );
    try {
      await removeIrt({ projectId: currentRow.id });
      hide();
      message.success(
        `${intl.formatMessage({
          id: 'message.deleteIRTSuccess',
          defaultMessage: '删除IRT成功！',
        })}`,
      );
      return true;
    } catch (error) {
      hide();
      message.error(
        `${intl.formatMessage({
          id: 'message.deleteFail',
          defaultMessage: '删除失败，请重试！',
        })}`,
      );
      return false;
    }
  };

  /**
   * 导出项目
   * @param currentRow
   */
  const handleExport = async (projectId: string) => {
    if (!projectId) return true;
    const hide = message.loading(
      `${intl.formatMessage({
        id: 'message.exporting',
        defaultMessage: '正在导出...',
      })}`,
    );
    try {
      await report({ projectId });
      hide();
      message.success(
        `${intl.formatMessage({
          id: 'message.exportSuccess',
          defaultMessage: '导出项目成功！',
        })}`,
      );
      return true;
    } catch (error) {
      hide();
      message.error(
        `${intl.formatMessage({
          id: 'message.exportFail',
          defaultMessage: '导出项目失败，请重试',
        })}`,
      );
      return false;
    }
  };

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

  useEffect(() => {
    const init = async () => {
      try {
        const result = await getDict();
        result.data.map((item: any) => {
          sessionStorage.setItem(item.name, JSON.stringify(item.item));
          return true;
        });
        return true;
      } catch (err) {
        return false;
      }
    };
    init();
  }, []);

  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInTable: true,
      render: (dom) => {
        return <Tag>{dom}</Tag>;
      },
    },
    {
      key: 'group',
      title: intl.formatMessage({
        id: 'table.group',
        defaultMessage: '分组',
      }),
      dataIndex: 'group',
      showSorterTooltip: false,
      sorter: (a, b) => {
        return a?.group > b?.group ? -1 : 1;
      },
      render: (text, entity) => {
        if (entity.group) {
          return <Tag>{entity.group}</Tag>;
        }
        return false;
      },
    },
    {
      key: 'name',
      title: intl.formatMessage({
        id: 'table.project.name',
        defaultMessage: '项目名称',
      }),
      dataIndex: 'name',
      render: (dom, record) => {
        return (
          <Tooltip title={`Id:${record.id}`} placement="topLeft">
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
      key: 'alias',
      title: intl.formatMessage({
        id: 'table.alias',
        defaultMessage: '别名',
      }),
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
      title: intl.formatMessage({
        id: 'table.experiment.number',
        defaultMessage: '实验数',
      }),
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
                <Tag color="green">
                  {intl.formatMessage({
                    id: 'table.check',
                    defaultMessage: '查看',
                  })}
                </Tag>
              </Link>
            ) : null}
          </>
        );
      },
    },
    {
      key: 'overviewCount',
      title: intl.formatMessage({
        id: 'table.overview.number',
        defaultMessage: '分析数',
      }),
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
                <Tag color="green">
                  {intl.formatMessage({
                    id: 'table.check',
                    defaultMessage: '查看',
                  })}
                </Tag>
              </Link>
            ) : null}
          </>
        );
      },
    },
    {
      key: 'type',
      title: intl.formatMessage({
        id: 'table.type',
        defaultMessage: '类型',
      }),
      dataIndex: 'type',
      hideInSearch: true,
    },
    {
      key: 'owner',
      title: intl.formatMessage({
        id: 'table.director',
        defaultMessage: '负责人',
      }),
      dataIndex: 'owner',
    },
    {
      key: 'insLibName',
      title: intl.formatMessage({
        id: 'table.innerLibrary',
        defaultMessage: '内标库',
      }),
      dataIndex: 'insLibName',
      hideInSearch: true,
      render: (dom, entity) => {
        if (!entity.insLibName) {
          return (
            <Tag color="red">
              {intl.formatMessage({
                id: 'table.notSet',
                defaultMessage: '未设置',
              })}
            </Tag>
          );
        }
        return (
          <Tooltip title={dom}>
            <Link to={{ pathname: '/peptide/list', search: `?libraryId=${entity.insLibId}` }}>
              <Tag color="blue">{entity.insLibName}</Tag>
            </Link>
          </Tooltip>
        );
      },
    },
    {
      key: 'anaLibName',
      title: intl.formatMessage({
        id: 'table.standardLibrary',
        defaultMessage: '标准库',
      }),
      dataIndex: 'anaLibName',
      hideInSearch: true,
      render: (dom, entity) => {
        if (!entity.insLibName) {
          return (
            <Tag color="red">
              {intl.formatMessage({
                id: 'table.notSet',
                defaultMessage: '未设置',
              })}
            </Tag>
          );
        }
        return (
          <Tooltip title={dom}>
            <Link to={{ pathname: '/peptide/list', search: `?libraryId=${entity.anaLibId}` }}>
              <Tag color="blue">{entity.anaLibName}</Tag>
            </Link>
          </Tooltip>
        );
      },
    },
    {
      key: 'methodName',
      title: intl.formatMessage({
        id: 'table.methodPackage',
        defaultMessage: '方法包',
      }),
      dataIndex: 'methodName',
      hideInSearch: true,
      render: (dom, entity) => {
        if (!entity.methodName) {
          return (
            <Tag color="red">
              {intl.formatMessage({
                id: 'table.notSet',
                defaultMessage: '未设置',
              })}
            </Tag>
          );
        }
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
      },
    },
    {
      key: 'tags',
      title: intl.formatMessage({
        id: 'table.tags',
        defaultMessage: '标签',
      }),
      dataIndex: 'tags',
      hideInSearch: true,
      render: (text, entity) => {
        if (entity.tags && entity.tags.length !== 0) {
          const tagsDom: any[] = [];
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
      title: intl.formatMessage({
        id: 'table.creatTime',
        defaultMessage: '创建时间',
      }),
      dataIndex: 'createDate',
      valueType: 'dateTime',
      hideInSearch: true,
      showSorterTooltip: false,
      sorter: (a, b) => {
        return a?.createDate > b?.createDate ? -1 : 1;
      },
    },
    {
      key: 'option',
      title: intl.formatMessage({
        id: 'table.option',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      fixed: 'right',
      width: '210px',
      hideInSearch: true,
      render: (text, record) => (
        <>
          <a
            onClick={() => {
              formUpdate?.resetFields();
              handleUpdateModalVisible(true);
              setCurrentRow(record);
            }}
          >
            <Tag color="blue">
              <Icon style={{ verticalAlign: '-5px', fontSize: '18px' }} icon="mdi:file-edit" />
              {intl.formatMessage({
                id: 'table.edit',
                defaultMessage: '编辑',
              })}
            </Tag>
          </a>
          <a
            onClick={() => {
              setCurrentRow(record);
              setShowDetail(true);
            }}
          >
            <Tag color="blue">
              <Icon style={{ verticalAlign: '-5px', fontSize: '18px' }} icon="mdi:file-document" />
              {intl.formatMessage({
                id: 'table.detail',
                defaultMessage: '详情',
              })}
            </Tag>
          </a>
          <Link
            to={{
              pathname: '/experiment/list',
              search: `?projectId=${record.id}`,
              state: { projectName: record.name },
            }}
          >
            <Tag color="blue">
              <Icon style={{ verticalAlign: '-5px', fontSize: '18px' }} icon="mdi:calculator" />
              {intl.formatMessage({
                id: 'table.exp',
                defaultMessage: '实验',
              })}
            </Tag>
          </Link>
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
      <ProTable<TableListItem, TableListPagination>
        // scroll={{ x: 'max-content' }}
        headerTitle={intl.formatMessage({
          id: 'table.projectList',
          defaultMessage: '项目列表',
        })}
        actionRef={actionRef}
        rowKey="id"
        size="small"
        toolBarRender={() => [
          <>
            <a key="add">
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
                {intl.formatMessage({
                  id: 'table.add',
                  defaultMessage: '新增',
                })}
              </Tag>
            </a>
          </>,
          <>
            <a
              key="scan"
              onClick={() => {
                if (selectedRows?.length > 0) {
                  if (selectedRows.length === 1) {
                    handleScan({ projectId: selectedRows[0].id });
                  } else {
                    message.warn(
                      `${intl.formatMessage({
                        id: 'message.singleProjectScan',
                        defaultMessage: '目前只支持单个项目的扫描',
                      })}`,
                    );
                    setSelectedRows([]);
                  }
                } else {
                  message.warn(
                    `${intl.formatMessage({
                      id: 'message.deleteProjectScan',
                      defaultMessage: '请选择要扫描的项目',
                    })}`,
                  );
                }
              }}
            >
              <Tag color="blue">
                <Icon style={{ verticalAlign: '-4px', fontSize: '16px' }} icon="mdi:file-search" />
                {intl.formatMessage({
                  id: 'table.scanUpdate',
                  defaultMessage: '扫描并更新',
                })}
              </Tag>
            </a>
          </>,
          <>
            {selectedRows && selectedRows.length === 1 ? (
              <Link
                key="clinic"
                target="_blank"
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
                  {intl.formatMessage({
                    id: 'menu.proteinClinic',
                    defaultMessage: '蛋白诊所',
                  })}
                </Tag>
              </Link>
            ) : (
              <a
                key="clinic"
                onClick={() => {
                  message.warn(
                    `${intl.formatMessage({
                      id: 'message.selectOneProject',
                      defaultMessage: '请选择一个项目',
                    })}`,
                  );
                }}
              >
                <Tag color="blue">
                  <Icon
                    style={{ verticalAlign: '-4px', fontSize: '16px' }}
                    icon="mdi:stethoscope"
                  />
                  {intl.formatMessage({
                    id: 'table.clinic',
                    defaultMessage: '蛋白诊所',
                  })}
                </Tag>
              </a>
            )}
          </>,
          <>
            <a
              key="export"
              onClick={() => {
                if (selectedRows?.length > 0) {
                  if (selectedRows.length === 1) {
                    handleExport(selectedRows[0].id);
                  } else {
                    message.warn(
                      `${intl.formatMessage({
                        id: 'message.selectOneProject',
                        defaultMessage: '目前只支持单个项目的导出',
                      })}`,
                    );
                    setSelectedRows([]);
                  }
                } else {
                  message.warn(
                    `${intl.formatMessage({
                      id: 'message.selectOneProject',
                      defaultMessage: '请选择要导出的项目',
                    })}`,
                  );
                }
              }}
            >
              <Tag color="blue">
                <Icon style={{ verticalAlign: '-4px', fontSize: '16px' }} icon="mdi:file-export" />
                {intl.formatMessage({
                  id: 'table.export',
                  defaultMessage: '导出',
                })}
              </Tag>
            </a>
          </>,
          <Dropdown
            key="delete"
            overlay={
              <Menu>
                <Menu.Item key="1">
                  <a
                    key="deleteRes"
                    onClick={() => {
                      if (selectedRows?.length > 0) {
                        if (selectedRows.length === 1) {
                          formDeleteRes?.resetFields();
                          handleDelete1ModalVisible(true);
                        }
                        if (selectedRows.length > 1) {
                          message.warn(
                            `${intl.formatMessage({
                              id: 'message.deleteOneProject',
                              defaultMessage: '目前只支持单个项目的删除！',
                            })}`,
                          );
                          setSelectedRows([]);
                        }
                      } else {
                        message.warn(
                          `${intl.formatMessage({
                            id: 'message.selectOneProject',
                            defaultMessage: '请选择一个项目',
                          })}`,
                        );
                      }
                    }}
                  >
                    <Tag color="error">
                      <Icon
                        style={{ verticalAlign: '-5px', fontSize: '18px' }}
                        icon="mdi:delete-sweep"
                      />
                      {intl.formatMessage({
                        id: 'table.deleteAnaRes',
                        defaultMessage: '删除分析结果',
                      })}
                    </Tag>
                  </a>
                </Menu.Item>
                <Menu.Item key="2">
                  <a
                    key="deleteIrt"
                    onClick={() => {
                      if (selectedRows?.length > 0) {
                        if (selectedRows.length === 1) {
                          formDeleteIrt?.resetFields();
                          handleDelete2ModalVisible(true);
                        }
                        if (selectedRows.length > 1) {
                          message.warn(
                            `${intl.formatMessage({
                              id: 'message.deleteOneProject',
                              defaultMessage: '目前只支持单个项目的删除！',
                            })}`,
                          );
                          setSelectedRows([]);
                        }
                      } else {
                        message.warn(
                          `${intl.formatMessage({
                            id: 'message.selectOneProject',
                            defaultMessage: '请选择一个项目',
                          })}`,
                        );
                      }
                    }}
                  >
                    <Tag color="error">
                      <Icon
                        style={{ verticalAlign: '-5px', fontSize: '18px' }}
                        icon="mdi:delete-sweep"
                      />
                      {intl.formatMessage({
                        id: 'table.deleteIrt',
                        defaultMessage: '删除IRT',
                      })}
                    </Tag>
                  </a>
                </Menu.Item>
                <Menu.Item key="3">
                  <a
                    key="deletePjc"
                    onClick={() => {
                      if (selectedRows?.length > 0) {
                        if (selectedRows.length === 1) {
                          formDelete?.resetFields();
                          handleDeleteModalVisible(true);
                        }
                        if (selectedRows.length > 1) {
                          message.warn(
                            `${intl.formatMessage({
                              id: 'message.deleteOneProject',
                              defaultMessage: '目前只支持单个项目的删除！',
                            })}`,
                          );
                          setSelectedRows([]);
                        }
                      } else {
                        message.warn(
                          `${intl.formatMessage({
                            id: 'message.selectOneProject',
                            defaultMessage: '请选择一个项目',
                          })}`,
                        );
                      }
                    }}
                  >
                    <Tag color="error">
                      <Icon
                        style={{ verticalAlign: '-5px', fontSize: '18px' }}
                        icon="mdi:delete-sweep"
                      />
                      {intl.formatMessage({
                        id: 'table.deletePro',
                        defaultMessage: '删除项目',
                      })}
                    </Tag>
                  </a>
                </Menu.Item>
              </Menu>
            }
          >
            <Tag color="error">
              <Icon style={{ verticalAlign: '-5px', fontSize: '18px' }} icon="mdi:delete" />
              {intl.formatMessage({
                id: 'table.delete',
                defaultMessage: '删除',
              })}
            </Tag>
          </Dropdown>,
        ]}
        search={{ span: 4 }}
        tableAlertRender={false}
        pagination={{
          total,
        }}
        request={async (params: {
          current?: number | undefined;
          pageSize?: number | undefined;
        }) => {
          const msg = await projectList({ ...params });
          setTotal(msg.totalNum);
          return Promise.resolve(msg);
        }}
        columns={columns}
        onRow={(record: any) => {
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
          onChange: (_, selectedRowKeys: any) => {
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
        onCancel={() => {
          handleUpdateModalVisible(false);
          setCurrentRow(undefined);
          formUpdate?.resetFields();
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
            message.error(
              `${intl.formatMessage({
                id: 'message.deleteInputFail',
                defaultMessage: '输入错误，请重新输入！',
              })}`,
            );
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
          if (value.name === 'ok fine') {
            const success = await handleRmRes(selectedRows[0]);
            if (success) {
              handleDelete1ModalVisible(false);
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
          if (value.name === 'ok fine') {
            const success = await handleRmIrt(selectedRows[0]);
            if (success) {
              handleDelete2ModalVisible(false);
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
        delete2ModalVisible={delete2ModalVisible}
        values={selectedRows[0] || {}}
      />
    </>
  );
};

export default TableList;
