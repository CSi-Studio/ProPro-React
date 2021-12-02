/* eslint-disable no-param-reassign */
import { Icon } from '@iconify/react';
import { Form, message, Tag, Tooltip, Typography, Button } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {
  batchUpdate,
  runList,
  overviewList,
  removeList,
  updateList,
  statistic,
  reselect,
} from './service';
import type { TableListItem, TableListPagination } from './data';
import UpdateForm from './components/UpdateForm';
import { Link } from 'umi';
import DetailForm from './components/OverviewDetail';
import DeleteForm from './components/DeleteForm';
import BatchUpdateForm from './components/BatchUpdateForm';
import ReselectForm from './components/ReselectForm';
import SelectDef from './components/SelectDef';
import { useIntl, FormattedMessage } from 'umi';

const { Text } = Typography;
const TableList: React.FC = (props: Record<string, any>) => {
  const intl = useIntl();

  /**
   * 更新库
   * @param values
   */
  const handleUpdate = async (values: any) => {
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
   * 批量修改
   * @param values
   */
  const handleBatchUpdate = async (values: any) => {
    const hide = message.loading(
      `${intl.formatMessage({
        id: 'message.updating',
        defaultMessage: '正在更新...',
      })}`,
    );
    try {
      await batchUpdate({ ...values });
      hide();
      message.success(
        `${intl.formatMessage({
          id: 'message.batchEditSuc',
          defaultMessage: '批量修改成功！',
        })}`,
      );
      return true;
    } catch (error) {
      hide();
      message.error(
        `${intl.formatMessage({
          id: 'message.batchEditFail',
          defaultMessage: '批量修改失败，请重试！',
        })}`,
      );
      return false;
    }
  };

  /**
   * 批量统计
   * @param values
   */
  const handleStatistic = async (values: any) => {
    const hide = message.loading(
      `${intl.formatMessage({
        id: 'message.statistic',
        defaultMessage: '正在统计...',
      })}`,
    );
    try {
      await statistic({ ...values });
      hide();
      message.success(
        `${intl.formatMessage({
          id: 'message.batchStatSuc',
          defaultMessage: '批量统计成功！',
        })}`,
      );
      return true;
    } catch (error) {
      hide();
      message.error(
        `${intl.formatMessage({
          id: 'message.batchStatFail',
          defaultMessage: '批量统计失败，请重试！',
        })}`,
      );
      return false;
    }
  };

  /**
   * 批量reselect
   * @param values
   */
  const handleReselect = async (values: any) => {
    const hide = message.loading(
      `${intl.formatMessage({
        id: 'message.reSelecting',
        defaultMessage: 'reSelecting...',
      })}`,
    );
    try {
      await reselect({ ...values });
      hide();
      message.success(
        `${intl.formatMessage({
          id: 'message.reSelecting',
          defaultMessage: 'ReSelect成功！',
        })}`,
      );
      return true;
    } catch (error) {
      hide();
      message.error(
        `${intl.formatMessage({
          id: 'message.reSelecting',
          defaultMessage: 'ReSelect失败！',
        })}`,
      );
      return false;
    }
  };

  /**
   * 删除库
   * @param selectedRows
   */
  const handleRemove = async (selectedRows: any[]) => {
    const overviewIds = selectedRows.map((item) => {
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
        overviewIds,
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
  const [formUpdate] = Form.useForm();
  const [formDelete] = Form.useForm();
  const [formBatch] = Form.useForm();
  const projectName = props?.location?.state?.projectName;
  const runName = props?.location?.state?.runName;
  const projectId = props?.location?.query?.projectId;
  const runId = props?.location?.query?.runId;

  const [data, setData] = useState<any>({});

  useEffect(() => {
    const init = async () => {
      const b: Record<any, any> = {};
      try {
        const a = await runList({
          projectId,
        });
        a?.data?.forEach((item: { name: string | number; id: any }) => {
          b[item.id] = item.name;
        });
        setData(b);
        return true;
      } catch (error) {
        return false;
      }
    };
    init();
  }, []);

  // /** 全选 */
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  /** 库详情的抽屉 */
  const [showDetail, setShowDetail] = useState<boolean>(false);
  // const [showLink, setShowLink] = useState<boolean>(false);
  const [total, setTotal] = useState<any>();
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  /** 更新窗口的弹窗 */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  /** Reselect的弹窗 */
  const [reselectVisible, handleReselectVisible] = useState<boolean>(false);
  /** 快速选择默认的弹窗 */
  const [selectDefVisible, handleSelectDefVisible] = useState<boolean>(false);
  /** 删除窗口的弹窗 */
  const [deleteModalVisible, handleDeleteModalVisible] = useState<boolean>(false);
  /** 批量修改窗口的弹窗 */
  const [batchModalVisible, handleBatchModalVisible] = useState<boolean>(false);
  const columns: ProColumns<TableListItem>[] = [
    {
      key: 'runName',
      title: <FormattedMessage id="table.runName" />,
      dataIndex: 'runName',
      hideInSearch: true,
      showSorterTooltip: false,
      sorter: (a, b) => {
        return a?.runName > b?.runName ? -1 : 1;
      },
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
      key: 'runId',
      title: <FormattedMessage id="table.runId" />,
      dataIndex: 'runId',
      hideInTable: true,
      renderFormItem: (_, { defaultRender }) => {
        return defaultRender(_);
      },
      showSorterTooltip: false,
      sorter: (a, b) => {
        return a?.runId > b?.runId ? -1 : 1;
      },
      valueEnum: {
        ...data,
      },
    },
    {
      key: 'defaultOne',
      title: <FormattedMessage id="table.justDefault" />,
      dataIndex: 'defaultOne',
      width: '70px',
      hideInSearch: true,
      showSorterTooltip: false,
      sorter: (a, b) => {
        return a?.defaultOne > b?.defaultOne ? -1 : 1;
      },
      render: (text) => {
        return text ? <Tag color="green">Yes</Tag> : <Tag color="red">No</Tag>;
      },
    },
    {
      key: 'reselect',
      title: <FormattedMessage id="table.reSelect" />,
      width: '70px',
      dataIndex: 'reselect',
      hideInSearch: true,
      showSorterTooltip: false,
      sorter: (a, b) => {
        return a?.reselect > b?.reselect ? -1 : 1;
      },
      render: (text) => {
        return text ? <Tag color="green">Yes</Tag> : <Tag color="red">No</Tag>;
      },
    },
    {
      key: 'minTotalScore',
      title: <FormattedMessage id="component.minTotalScore" />,
      width: '70px',
      dataIndex: 'minTotalScore',
      hideInSearch: true,
      render: (text, entity) => {
        return <Tag color="blue">{entity?.minTotalScore?.toFixed(3)}</Tag>;
      },
    },
    {
      key: 'peakCount',
      title: <FormattedMessage id="table.peakCount" />,
      dataIndex: 'statstic',
      hideInSearch: true,
      render: (text, entity) => {
        return <Tag color="blue">{entity?.statistic?.TOTAL_PEAK_COUNT}</Tag>;
      },
    },
    {
      key: 'peptideCount',
      title: <FormattedMessage id="table.peptideNum" />,
      dataIndex: 'statstic',
      hideInSearch: true,
      render: (text, entity) => {
        return <Tag color="blue">{entity?.statistic?.TOTAL_PEPTIDE_COUNT}</Tag>;
      },
    },
    {
      key: 'matchedTotalPeptideCount',
      title: <FormattedMessage id="table.identPeptideUni" />,
      dataIndex: 'statstic',
      hideInSearch: true,
      render: (text, entity) => {
        return <Tag color="blue">{entity?.statistic?.MATCHED_UNIQUE_PEPTIDE_COUNT}</Tag>;
      },
    },
    {
      key: 'matchedUniquePeptideCount',
      title: <FormattedMessage id="table.identPeptideAll" />,
      dataIndex: 'statstic',
      hideInSearch: true,
      render: (text, entity) => {
        return <Tag color="blue">{entity?.statistic?.MATCHED_TOTAL_PEPTIDE_COUNT}</Tag>;
      },
    },
    {
      key: 'matchedTotalProteinCount',
      title: <FormattedMessage id="table.identProteinUni" />,
      dataIndex: 'statstic',
      hideInSearch: true,
      render: (text, entity) => {
        return <Tag color="blue">{entity?.statistic?.MATCHED_UNIQUE_PROTEIN_COUNT}</Tag>;
      },
    },
    {
      key: 'matchedTotalProteinCount',
      title: <FormattedMessage id="table.identProteinAll" />,
      dataIndex: 'statstic',
      hideInSearch: true,
      render: (text, entity) => {
        return <Tag color="blue">{entity?.statistic?.MATCHED_TOTAL_PROTEIN_COUNT}</Tag>;
      },
    },
    {
      key: 'tags',
      title: <FormattedMessage id="table.tags" />,
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
      key: 'note',
      title: <FormattedMessage id="table.remark" />,
      dataIndex: 'note',
      width: '160px',
      hideInSearch: true,
      showSorterTooltip: false,
      sorter: (a, b) => {
        return a?.note > b?.note ? -1 : 1;
      },
      render: (dom) => {
        if (dom === '-') {
          return false;
        }
        return <span>{dom}</span>;
      },
    },
    {
      key: 'createDate',
      title: <FormattedMessage id="table.creatTime" />,
      dataIndex: 'createDate',
      valueType: 'dateTime',
      width: '160px',
      hideInSearch: true,
      showSorterTooltip: false,
      sorter: (a, b) => {
        return a?.createDate > b?.createDate ? -1 : 1;
      },
      render: (dom) => {
        if (dom === '-') {
          return false;
        }
        return <Tag>{dom}</Tag>;
      },
    },
    {
      key: 'option',
      title: <FormattedMessage id="table.option" />,
      valueType: 'option',
      fixed: 'right',
      width: '240px',
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
              <Icon style={{ verticalAlign: 'middle', fontSize: '20px' }} icon="mdi:file-edit" />
              <FormattedMessage id="table.edit" />
            </Tag>
          </a>
          <a
            onClick={() => {
              setCurrentRow(record);
              setShowDetail(true);
            }}
          >
            <Tag color="blue">
              <Icon
                style={{ verticalAlign: 'middle', fontSize: '20px' }}
                icon="mdi:file-document"
              />
              <FormattedMessage id="table.detail" />
            </Tag>
          </a>
          <Link
            to={{
              pathname: '/data/list',
              search: `?overviewId=${record.id}`,
              state: { overviewName: record.name },
            }}
          >
            <Tag color="blue">
              <Icon style={{ verticalAlign: 'middle', fontSize: '20px' }} icon="mdi:read" />
              <FormattedMessage id="table.result" />
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
  /* 判断是否选中相同runId的行 */
  const isRepeat = (arr: any) => {
    const hash = {};
    for (let i = 0; i < arr.length; i++) {
      if (hash[arr[i]]) {
        return true;
      }
      hash[arr[i]] = true;
    }
    return false;
  };

  return (
    <>
      <ProTable<TableListItem, TableListPagination>
        scroll={{ x: 'max-content' }}
        headerTitle={
          projectName === undefined ? (
            <>
              <Text>
                {' '}
                <FormattedMessage id="table.switchOv" />
              </Text>
            </>
          ) : (
            <>
              <Link
                to={{
                  pathname: '/project/list',
                }}
              >
                <Text type="secondary">
                  {' '}
                  <FormattedMessage id="table.projectList" />
                </Text>
              </Link>
              &nbsp;&nbsp;/&nbsp;&nbsp;
              {runName === undefined ? (
                <>
                  <a>
                    <Text>
                      <FormattedMessage id="table.switchOv" />{' '}
                      <FormattedMessage id="table.belongPro" />：{projectName}
                    </Text>
                  </a>
                  &nbsp;&nbsp;
                  <Link
                    to={{
                      pathname: '/run/list',
                      state: { projectName, projectId },
                      search: `?projectId=${projectId}`,
                    }}
                  >
                    <Button type="primary" size="small">
                      <FormattedMessage id="table.runList" />
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to={{
                      pathname: '/run/list',
                      state: { projectName, projectId },
                      search: `?projectId=${projectId}`,
                    }}
                  >
                    <Text type="secondary">
                      {' '}
                      <FormattedMessage id="table.runList" />
                    </Text>
                  </Link>
                  &nbsp;&nbsp;/&nbsp;&nbsp;
                  <a>
                    <Text>
                      <FormattedMessage id="table.switchOv" />{' '}
                      <FormattedMessage id="table.belongRun" /> ：{runName}
                    </Text>
                  </a>
                </>
              )}
            </>
          )
        }
        actionRef={actionRef}
        rowKey="id"
        size="small"
        search={{ labelWidth: 'auto', span: 5 }}
        toolBarRender={() => [
          <a
            key="batchRestatistic"
            onClick={async () => {
              if (selectedRows?.length > 0) {
                const idList = selectedRows.map((item) => {
                  return item.id;
                });
                const result = await handleStatistic({ idList });
                if (result) {
                  if (actionRef.current) {
                    actionRef.current.reload();
                  }
                }
              } else {
                message.warn(
                  `${intl.formatMessage({
                    id: 'message.selectOv',
                    defaultMessage: '请选择要修改的概览，支持多选',
                  })}`,
                );
              }
            }}
          >
            <Tag color="green">
              <Icon style={{ verticalAlign: '-4px', fontSize: '16px' }} icon="mdi:scatter-plot" />
              <FormattedMessage id="table.reCountProtein" />
            </Tag>
          </a>,
          <a
            key="batchReselect"
            onClick={async () => {
              if (selectedRows?.length > 0) {
                handleReselectVisible(true);
              } else {
                message.warn(
                  `${intl.formatMessage({
                    id: 'message.selectOv',
                    defaultMessage: '请选择要修改的概览，支持多选',
                  })}`,
                );
              }
            }}
          >
            <Tag color="yellow">
              <Icon style={{ verticalAlign: '-4px', fontSize: '16px' }} icon="mdi:select-compare" />
              Reselect
            </Tag>
          </a>,
          <a
            key="batchReselectDef"
            onClick={async () => {
              if (selectedRows?.length > 0) {
                handleSelectDefVisible(true);
              } else {
                message.warn(
                  `${intl.formatMessage({
                    id: 'message.selectOv',
                    defaultMessage: '请选择要修改的概览，支持多选',
                  })}`,
                );
              }
            }}
          >
            <Tag color="blue">
              <Icon style={{ verticalAlign: '-4px', fontSize: '16px' }} icon="mdi:gesture-tap" />
              <FormattedMessage id="table.switchDef" />
            </Tag>
          </a>,
          <>
            {selectedRows &&
            selectedRows.length > 0 &&
            !isRepeat(
              selectedRows.map((row) => {
                return row.runId;
              }),
            ) ? (
              <Link
                key="clinic"
                target="_blank"
                to={{
                  pathname: '/clinic',
                  search: `?projectId=${selectedRows[0].projectId}&overviewIds=${selectedRows.map(
                    (item) => {
                      return item.id;
                    },
                  )}`,
                }}
              >
                <Tag color="blue">
                  <Icon
                    style={{ verticalAlign: '-4px', fontSize: '16px' }}
                    icon="mdi:stethoscope"
                  />
                  <FormattedMessage id="table.clinic" />
                </Tag>
              </Link>
            ) : (
              <a
                key="clinic"
                onClick={() => {
                  message.warn(
                    `${intl.formatMessage({
                      id: 'message.selectDifRun',
                      defaultMessage: '请至少选择一个Run，多选请选择不同的Run名',
                    })}`,
                  );
                }}
              >
                <Tag color="blue">
                  <Icon
                    style={{ verticalAlign: '-4px', fontSize: '16px' }}
                    icon="mdi:stethoscope"
                  />
                  <FormattedMessage id="table.clinic" />
                </Tag>
              </a>
            )}
          </>,
          <a
            key="batchEdit"
            onClick={async () => {
              formBatch?.resetFields();
              if (selectedRows?.length > 0) {
                handleBatchModalVisible(true);
              } else {
                message.warn(
                  `${intl.formatMessage({
                    id: 'message.selectOv',
                    defaultMessage: '请选择要修改的概览，支持多选',
                  })}`,
                );
              }
            }}
          >
            <Tag color="blue">
              <Icon style={{ verticalAlign: '-4px', fontSize: '16px' }} icon="mdi:table-edit" />
              <FormattedMessage id="table.batchEdit" />
            </Tag>
          </a>,
          <a
            key="delete"
            onClick={async () => {
              formDelete?.resetFields();
              if (selectedRows?.length > 0) {
                handleDeleteModalVisible(true);
              } else {
                message.warn(
                  `${intl.formatMessage({
                    id: 'message.selectOv',
                    defaultMessage: '请选择要修改的概览，支持多选',
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
        tableAlertRender={false}
        pagination={{
          total,
          hideOnSinglePage: true,
          size: 'small',
          defaultPageSize: 100,
          // showSizeChanger: false,
          // showQuickJumper: false,
          showTotal: () => null,
          position: ['bottomRight'],
        }}
        request={async (params) => {
          if (projectId) {
            const msg = await overviewList({ projectId, runId, ...params });
            setTotal(msg.totalNum);
            return Promise.resolve(msg);
          }
          return null;
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
          value.id = currentRow?.id as unknown as string;
          const mapValue = {
            id: value.id,
            tags: value.tags,
            note: value.note,
            defaultOne: value.defaultOne,
          };
          const success = await handleUpdate(mapValue);
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
      {/* Reselect确认界面 */}
      <ReselectForm
        selectedRows={selectedRows}
        onCancel={() => {
          handleReselectVisible(false);
          setSelectedRows([]);
        }}
        onSubmit={async () => {
          const overviewIds = selectedRows.map((item) => {
            return item.id;
          });
          const result = await handleReselect({ overviewIds });
          if (result) {
            handleReselectVisible(false);
            setSelectedRows([]);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        reselectVisible={reselectVisible}
      />
      {/* 快速选择默认界面 */}
      <SelectDef
        selectedRows={selectedRows}
        onCancel={() => {
          handleSelectDefVisible(false);
          setSelectedRows([]);
        }}
        onSubmit={async () => {
          const mapValue = {
            ids: selectedRows.map((item) => {
              return item.id;
            }),
            defaultOne: true,
          };
          const success = await handleBatchUpdate(mapValue);
          if (success) {
            handleSelectDefVisible(false);
            setSelectedRows([]);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        selectDefVisible={selectDefVisible}
      />
      <BatchUpdateForm
        form={formBatch}
        onCancel={() => {
          handleBatchModalVisible(false);
          setSelectedRows([]);
          formBatch?.resetFields();
        }}
        onSubmit={async (value) => {
          const mapValue = {
            ids: selectedRows.map((item) => {
              return item.id;
            }),
            tags: value.tags,
            note: value.note,
            defaultOne: value.defaultOne,
          };
          const success = await handleBatchUpdate(mapValue);
          if (success) {
            handleBatchModalVisible(false);
            setSelectedRows([]);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        batchModalVisible={batchModalVisible}
        values={selectedRows.length}
      />
    </>
  );
};

export default TableList;
