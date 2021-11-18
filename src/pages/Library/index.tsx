import { Dropdown, Menu, message, Tag, Tooltip, Form } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import {
  libraryList,
  addList,
  cloneList,
  removeList,
  updateList,
  generateDecoys,
  repeatCount,
  statistic,
} from './service';
import type { TableListItem, TableListPagination } from './data';
import type { addFormValueType } from './components/CreateForm';
import CreateForm from './components/CreateForm';
import type { updateFormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import DeleteForm from './components/DeleteForm';
import type { cloneFormValueType } from './components/CloneForm';
import CloneForm from './components/CloneForm';
import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { Icon } from '@iconify/react';
import DetailForm from './components/DetailForm';
import { Link, useIntl, FormattedMessage } from 'umi';

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
   * 克隆库
   * @param values
   */
  const handleClone = async (values: cloneFormValueType) => {
    const hide = message.loading(
      `${intl.formatMessage({
        id: 'message.cloning',
        defaultMessage: '正在克隆...',
      })}`,
    );
    try {
      await cloneList(values);
      hide();
      message.success(
        `${intl.formatMessage({
          id: 'message.cloneSuc',
          defaultMessage: '克隆成功！',
        })}`,
      );
      return true;
    } catch (error) {
      hide();
      message.error(
        `${intl.formatMessage({
          id: 'message.cloneFail',
          defaultMessage: '克隆失败，请重试！',
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
   * 生成伪肽段
   * @param values
   */
  const handleGenerate = async (values: { libraryId: any; generator: string }) => {
    const hide = message.loading(
      `${intl.formatMessage({
        id: 'message.generatingDecoy',
        defaultMessage: '正在生成伪肽段...',
      })}`,
    );
    try {
      await generateDecoys({ ...values });
      hide();
      message.success(
        `${intl.formatMessage({
          id: 'message.generateDecoySuc',
          defaultMessage: '生成伪肽段成功！',
        })}`,
      );
      return true;
    } catch (error) {
      hide();
      message.error(
        `${intl.formatMessage({
          id: 'message.generateDecoyFail',
          defaultMessage: '生成伪肽段失败，请重试！',
        })}`,
      );
      return false;
    }
  };
  /**
   * 生成基本统计信息
   * @param values
   */
  const handleStatistic = async (libraryId: string) => {
    const hide = message.loading(
      `${intl.formatMessage({
        id: 'message.genStatistic',
        defaultMessage: '正在生成基本统计信息...',
      })}`,
    );
    try {
      await statistic(libraryId);
      hide();
      message.success(
        `${intl.formatMessage({
          id: 'message.genStatisticSuc',
          defaultMessage: '生成基本统计信息成功！',
        })}`,
      );
      return true;
    } catch (error) {
      hide();
      message.error(
        `${intl.formatMessage({
          id: 'message.genStatisticFail',
          defaultMessage: '生成基本统计信息失败，请重试！',
        })}`,
      );
      return false;
    }
  };
  /**
   * 统计肽段重复率
   * @param values
   */
  const handleRepeatCount = async (libraryId: string) => {
    const hide = message.loading(
      `${intl.formatMessage({
        id: 'message.repeatCount',
        defaultMessage: '正在统计肽段重复率...',
      })}`,
    );
    try {
      await repeatCount(libraryId);
      hide();
      message.success(
        `${intl.formatMessage({
          id: 'message.repeatCountSuc',
          defaultMessage: '统计肽段重复率成功！',
        })}`,
      );
      return true;
    } catch (error) {
      hide();
      message.error(
        `${intl.formatMessage({
          id: 'message.repeatCountFail',
          defaultMessage: '统计肽段重复率失败，请重试！',
        })}`,
      );
      return false;
    }
  };

  /**
   * 删除库
   * @param selectedRows
   */
  const handleRemove = async (selectedRows: TableListItem[]) => {
    try {
      await removeList({
        libraryIds: selectedRows[0].id,
      });
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
  const [formClone] = Form.useForm();
  /** 全选 */
  const [selectedRows, setSelectedRows] = useState<TableListItem[]>([]);
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 删除窗口的弹窗 */
  const [deleteModalVisible, handleDeleteModalVisible] = useState<boolean>(false);
  /** 更新窗口的弹窗 */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  /** 克隆窗口的弹窗 */
  const [cloneModalVisible, handleCloneModalVisible] = useState<boolean>(false);
  /** 库详情的抽屉 */
  const [showDetail, setShowDetail] = useState<boolean>(false);

  const [pageNo] = useState<any>(0);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: <FormattedMessage id="component.libraryName" />,
      dataIndex: 'name',
      render: (dom, entity) => {
        return (
          <Tooltip title={`Id:${entity.id}`} placement="topLeft">
            <a
              onClick={() => {
                setCurrentRow(entity);
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
      title: 'LibraryId',
      dataIndex: 'id',
      hideInTable: true,
      render: (dom) => {
        return <Tag>{dom}</Tag>;
      },
    },
    {
      title: <FormattedMessage id="table.libraryType" />,
      dataIndex: 'type',
      showSorterTooltip: false,
      sorter: (a, b) => (a.type > b.type ? -1 : 1),
      render: (dom) => {
        if (dom === 'ANA') {
          return <Tag color="green">{dom}</Tag>;
        }
        return <Tag color="blue">{dom}</Tag>;
      },
    },
    {
      title: <FormattedMessage id="table.decoyPeptideAlgorithm" />,
      dataIndex: 'generator',
      hideInSearch: true,
      render: (dom, entity) => {
        if (
          entity.generator === 'undefined' ||
          entity.generator == null ||
          entity.generator === ''
        ) {
          return false;
        }
        if (dom === 'shuffle') {
          return <Tag color="green">{dom}</Tag>;
        }
        return <Tag color="blue">{dom}</Tag>;
      },
    },
    {
      title: <FormattedMessage id="table.organicSpecies" />,
      hideInSearch: true,
      dataIndex: 'organism',
      showSorterTooltip: false,
      sorter: (a, b) => (a.organism > b.organism ? -1 : 1),
      render: (dom, entity) => {
        if (entity.organism.length > 0) {
          return <Tag color="geekblue">{dom}</Tag>;
        }
        return (
          <Tag>
            <FormattedMessage id="table.notSet" />
          </Tag>
        );
      },
    },
    {
      title: <FormattedMessage id="table.proteinCount" />,
      dataIndex: 'Protein_Count',
      hideInSearch: true,
      showSorterTooltip: false,
      sorter: (a, b) => (a.Protein_Count > b.Protein_Count ? -1 : 1),
      render: (dom, entity) => {
        return <Tag>{entity?.statistic?.Protein_Count}</Tag>;
      },
    },
    {
      title: <FormattedMessage id="table.peptideCount" />,
      dataIndex: 'Peptide_Count',
      hideInSearch: true,
      showSorterTooltip: false,

      sorter: (a, b) => (a.Peptide_Count > b.Peptide_Count ? -1 : 1),
      render: (dom, entity) => {
        return (
          <>
            <Tag color={entity?.statistic?.Peptide_Count === 0 ? 'error' : 'blue'}>
              {entity?.statistic?.Peptide_Count}
            </Tag>
            <Link
              to={{
                pathname: `/peptide/list`,
                state: { libraryName: entity.name },
                search: `?libraryId=${entity.id}`,
              }}
            >
              <Tag color="green">
                <FormattedMessage id="table.check" />
              </Tag>
            </Link>
          </>
        );
      },
    },
    {
      title: <FormattedMessage id="table.fragmentCount" />,
      dataIndex: 'Fragment_Count',
      hideInSearch: true,
      showSorterTooltip: false,

      sorter: (a, b) => (a.Fragment_Count > b.Fragment_Count ? -1 : 1),
      render: (dom, entity) => {
        return <Tag>{entity?.statistic?.Fragment_Count}</Tag>;
      },
    },
    {
      title: <FormattedMessage id="table.description" />,
      dataIndex: 'description',
      hideInSearch: true,
      valueType: 'textarea',
      render: (dom, entity) => {
        if (
          entity.description === 'undefined' ||
          entity.description === null ||
          entity.description === ''
        ) {
          return (
            <Tag>
              <FormattedMessage id="table.empty" />
            </Tag>
          );
        }
        return (
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
        );
      },
    },
    {
      title: <FormattedMessage id="table.option" />,
      valueType: 'option',
      fixed: 'right',
      width: '160px',
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
              <FormattedMessage id="table.edit" />
            </Tag>
          </a>
          <a
            onClick={() => {
              setCurrentRow(record);
              setShowDetail(true);
            }}
            key="details"
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
      <ProTable<TableListItem, TableListPagination>
        scroll={{ x: 'max-content' }}
        headerTitle={intl.formatMessage({
          id: 'menu.library',
          defaultMessage: '靶库',
        })}
        actionRef={actionRef}
        rowKey="id"
        size="small"
        tableAlertRender={false}
        pagination={{
          current: pageNo,
        }}
        onRow={(record) => {
          return {
            onClick: () => {
              selectRow(record);
            },
          };
        }}
        toolBarRender={() => [
          <a
            key="add"
            onClick={() => {
              formCreate?.resetFields();
              handleModalVisible(true);
            }}
          >
            <Tag color="green">
              <Icon
                style={{ verticalAlign: 'middle', fontSize: '20px' }}
                icon="mdi:playlist-plus"
              />
              <FormattedMessage id="table.add" />
            </Tag>
          </a>,
          <a
            key="clone"
            onClick={() => {
              formClone?.resetFields();
              if (selectedRows?.length > 0) {
                if (selectedRows.length === 1) {
                  handleCloneModalVisible(true);
                  setSelectedRows([]);
                } else {
                  message.warn(
                    `${intl.formatMessage({
                      id: 'message.singleClone',
                      defaultMessage: '目前只支持单个库的克隆',
                    })}`,
                  );
                  setSelectedRows([]);
                }
              } else {
                message.warn(
                  `${intl.formatMessage({
                    id: 'message.selectLibrary',
                    defaultMessage: '请选择一个库',
                  })}`,
                );
              }
            }}
          >
            <Tag color="blue">
              <Icon style={{ verticalAlign: '-4px', fontSize: '16px' }} icon="mdi:content-copy" />
              <FormattedMessage id="table.clone" />
            </Tag>
          </a>,
          <Dropdown
            key="generateDecoys"
            overlay={
              <Menu>
                <Menu.Item key="1">
                  <a
                    key="Shuffle"
                    onClick={() => {
                      if (selectedRows?.length > 0) {
                        if (selectedRows.length === 1) {
                          const values = {
                            libraryId: selectedRows[0].id,
                            generator: 'shuffle',
                          };
                          handleGenerate(values);
                          setSelectedRows([]);
                        }
                        if (selectedRows.length > 1) {
                          message.warn(
                            `${intl.formatMessage({
                              id: 'message.singleGenerate',
                              defaultMessage: '目前只支持单个库的伪肽段生成',
                            })}`,
                          );
                          setSelectedRows([]);
                        }
                      } else {
                        message.warn(
                          `${intl.formatMessage({
                            id: 'message.selectLibrary',
                            defaultMessage: '请选择一个库',
                          })}`,
                        );
                      }
                    }}
                  >
                    <Tag>
                      <Icon
                        style={{ verticalAlign: '-5px', fontSize: '16px', color: '#0D93F7' }}
                        icon="mdi:alpha-s-circle"
                      />
                      <FormattedMessage id="table.shuffle" />
                    </Tag>
                  </a>
                </Menu.Item>
                <Menu.Item key="2">
                  <a
                    key="Nico"
                    onClick={() => {
                      if (selectedRows?.length > 0) {
                        if (selectedRows.length === 1) {
                          const values = {
                            libraryId: selectedRows[0].id,
                            generator: 'nico',
                          };
                          handleGenerate(values);
                          setSelectedRows([]);
                        }
                        if (selectedRows.length > 1) {
                          message.warn(
                            `${intl.formatMessage({
                              id: 'message.singleGenerate',
                              defaultMessage: '目前只支持单个库的伪肽段生成',
                            })}`,
                          );
                          setSelectedRows([]);
                        }
                      } else {
                        message.warn(
                          `${intl.formatMessage({
                            id: 'message.selectLibrary',
                            defaultMessage: '请选择一个库',
                          })}`,
                        );
                      }
                    }}
                  >
                    <Tag>
                      <Icon
                        style={{ verticalAlign: '-5px', fontSize: '16px', color: '#0D93F7' }}
                        icon="mdi:alpha-n-circle"
                      />
                      <FormattedMessage id="table.nico" />
                    </Tag>
                  </a>
                </Menu.Item>
                <Menu.Item key="2">
                  <a
                    key="Replace"
                    onClick={() => {
                      if (selectedRows?.length > 0) {
                        if (selectedRows.length === 1) {
                          const values = {
                            libraryId: selectedRows[0].id,
                            generator: 'replace',
                          };
                          handleGenerate(values);
                          setSelectedRows([]);
                        }
                        if (selectedRows.length > 1) {
                          message.warn(
                            `${intl.formatMessage({
                              id: 'message.singleGenerate',
                              defaultMessage: '目前只支持单个库的伪肽段生成',
                            })}`,
                          );
                          setSelectedRows([]);
                        }
                      } else {
                        message.warn(
                          `${intl.formatMessage({
                            id: 'message.selectLibrary',
                            defaultMessage: '请选择一个库',
                          })}`,
                        );
                      }
                    }}
                  >
                    <Tag>
                      <Icon
                        style={{ verticalAlign: '-5px', fontSize: '16px', color: '#0D93F7' }}
                        icon="mdi:alpha-n-circle"
                      />
                      <FormattedMessage id="table.replace" />
                    </Tag>
                  </a>
                </Menu.Item>
              </Menu>
            }
          >
            <Tag color="blue" key="generateDecoys">
              <Icon
                style={{ verticalAlign: '-5px', fontSize: '18px', color: '#0D93F7' }}
                icon="mdi:alpha-p-box"
              />
              <FormattedMessage id="table.generateDecoy" />
            </Tag>
          </Dropdown>,
          <a
            key="statistics"
            onClick={() => {
              if (selectedRows?.length > 0) {
                if (selectedRows.length === 1) {
                  handleStatistic(selectedRows[0].id);
                  setSelectedRows([]);
                } else {
                  message.warn(
                    `${intl.formatMessage({
                      id: 'message.singleStatistic',
                      defaultMessage: '目前只支持单个库的基本信息的统计',
                    })}`,
                  );
                  setSelectedRows([]);
                }
              } else {
                message.warn(
                  `${intl.formatMessage({
                    id: 'message.selectLibrary',
                    defaultMessage: '请选择一个库',
                  })}`,
                );
              }
            }}
          >
            <Tag color="blue">
              <Icon style={{ verticalAlign: '-4px', fontSize: '16px' }} icon="mdi:file-chart" />
              <FormattedMessage id="table.statisticsInfo" />
            </Tag>
          </a>,
          <a
            key="repeatCount"
            onClick={() => {
              if (selectedRows?.length > 0) {
                if (selectedRows.length === 1) {
                  handleRepeatCount(selectedRows[0].id);
                  setSelectedRows([]);
                } else {
                  message.warn(
                    `${intl.formatMessage({
                      id: 'message.singleRepeatCount',
                      defaultMessage: '目前只支持单个库的肽段重复率的统计',
                    })}`,
                  );
                  setSelectedRows([]);
                }
              } else {
                message.warn(
                  `${intl.formatMessage({
                    id: 'message.selectLibrary',
                    defaultMessage: '请选择一个库',
                  })}`,
                );
              }
            }}
          >
            <Tag color="blue">
              <Icon style={{ verticalAlign: '-4px', fontSize: '16px' }} icon="mdi:file-percent" />
              <FormattedMessage id="table.repeatCount" />
            </Tag>
          </a>,
          <a
            key="delete"
            onClick={async () => {
              formDelete?.resetFields();
              if (selectedRows?.length > 0) {
                if (selectedRows.length === 1) {
                  handleDeleteModalVisible(true);
                } else {
                  message.warn(
                    `${intl.formatMessage({
                      id: 'message.singleDeleteLibrary',
                      defaultMessage: '目前只支持单个库的删除',
                    })}`,
                  );
                  setSelectedRows([]);
                }
              } else {
                message.warn(
                  `${intl.formatMessage({
                    id: 'message.selectDeleteLibrary',
                    defaultMessage: '请选择要删除的库',
                  })}`,
                );
              }
            }}
          >
            <Tag color="error">
              <Icon style={{ verticalAlign: '-4px', fontSize: '16px' }} icon="mdi:delete" />
              <FormattedMessage id="table.delete" />
            </Tag>
          </a>,
        ]}
        request={libraryList}
        columns={columns}
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
        onSubmit={async (value: any) => {
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
          if (value.name === selectedRows[0]?.name) {
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
                id: 'message.deleteFail',
                defaultMessage: '删除失败，请重试！',
              })}`,
            );
          }
        }}
        deleteModalVisible={deleteModalVisible}
      />

      {/* 克隆列表 */}
      <CloneForm
        form={formClone}
        onCancel={() => {
          handleCloneModalVisible(false);
          setSelectedRows([]);
          formClone?.resetFields();
        }}
        onSubmit={async (params) => {
          const p: { id: any; newLibName: string; includeDecoy?: boolean } = {
            id: '',
            newLibName: '',
            includeDecoy: false,
          };
          p.id = selectedRows[0].id;
          p.newLibName = params.newLibName;
          p.includeDecoy = params.includeDecoy;

          const success = await handleClone(p);
          if (success) {
            handleCloneModalVisible(false);
            setSelectedRows([]);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        cloneModalVisible={cloneModalVisible}
        values={selectedRows}
      />
    </>
  );
};

export default TableList;
