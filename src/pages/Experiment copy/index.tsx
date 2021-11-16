/* eslint-disable no-param-reassign */
import { Tag, Tooltip, Form, message, Typography, Button } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { runList, analyze, prepare, getPeptide, getProteins, batchEdit } from './service';
import { updateList, generateAlias } from './service';
import type {
  AliasParams,
  AnalyzeParams,
  PrepareAnalyzeVO,
  TableListItem,
  TableListPagination,
} from './data';
import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { Icon } from '@iconify/react';
import DetailForm from './components/DetailForm';
import AnalyzeForm from './components/AnalyzeForm';
import { Link } from 'umi';
import ProteinSelectForm from './components/ProteinSelectForm';
import ProteinFixedChartsForm from './components/ProteinFixedChartsForm';
import UpdateForm from './components/UpdateForm';
import AliasForm from './components/AliasForm';
import BatchEditForm from './components/BatchEdit';
import { useIntl, FormattedMessage } from 'umi';

const { Text } = Typography;
const TableList: React.FC = (props: any) => {
  const intl = useIntl();

  const actionRef = useRef<ActionType>();
  const [formAnalyze] = Form.useForm();
  const [formUpdate] = Form.useForm();
  const [formBatch] = Form.useForm();
  const [formAlias] = Form.useForm();
  /* 分析窗口变量 */
  const [analyzeModalVisible, handleAnalyzeModalVisible] = useState<boolean>(false);
  /* 编辑窗口变量 */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  /* 生成别名 */
  const [aliasModalVisible, handleAliasModalVisible] = useState<boolean>(false);
  /** 全选 */
  const [selectedRows, setSelectedRows] = useState<TableListItem[]>([]);
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  /** 库详情的抽屉 */
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [prepareData, setPrepareData] = useState<PrepareAnalyzeVO>();
  const [proteinList, setProteinList] = useState<any>();
  const [showCharts, setShowCharts] = useState<boolean>(false);
  const [chartsData, setChartData] = useState<any>(false);
  const [proteinName, setProteinName] = useState<any>(false);
  /** 蛋白质选择界面 */
  const [proteinSelectVisible, setProteinSelectVisible] = useState<boolean>(false);
  /** 批量修改界面 */
  const [batchEditVisible, setBatchEditVisible] = useState<boolean>(false);

  const projectId = props?.location?.query?.projectId;
  const projectName = props?.location?.state?.projectName;

  /**
   * 更新库
   * @param values
   */
  const handleUpdate = async (values: any) => {
    const msgUpdate = intl.formatMessage({
      id: 'message.updating',
      defaultMessage: '正在更新...',
    });
    const hide = message.loading(msgUpdate);
    try {
      await updateList({ ...values });
      hide();
      const editSuccess = intl.formatMessage({
        id: 'message.editSuccess',
        defaultMessage: '编辑成功！',
      });
      message.success(editSuccess);
      return true;
    } catch (error) {
      hide();
      const editFail = intl.formatMessage({
        id: 'message.editFail',
        defaultMessage: '编辑失败，请重试！',
      });
      message.error(editFail);
      return false;
    }
  };
  /**
   * 生成别名
   * @param values
   */
  const handleAlias = async (value: any) => {
    const creating = intl.formatMessage({
      id: 'message.creating',
      defaultMessage: '正在生成...',
    });
    const hide = message.loading(creating);
    try {
      await generateAlias({ runIds: value.runIds, prefix: value.prefix, projectId });
      hide();
      const success = intl.formatMessage({
        id: 'message.generateSuccess',
        defaultMessage: '生成成功！',
      });
      message.success(success);
      if (actionRef.current) {
        actionRef.current.reload();
      }
      return true;
    } catch (error) {
      hide();
      const fail = intl.formatMessage({
        id: 'message.generateFail',
        defaultMessage: '生成失败，请重试！',
      });
      message.error(fail);
      return false;
    }
  };
  const columns: ProColumns<TableListItem>[] = [
    {
      title: <FormattedMessage id="table.group" />,
      dataIndex: 'group',
      showSorterTooltip: false,
      sorter: (a, b) => {
        return a?.group > b?.group ? -1 : 1;
      },
      render: (dom, entity) => {
        if (entity?.group) {
          return <Tag color="blue">{dom}</Tag>;
        }
        return false;
      },
    },
    {
      title: <FormattedMessage id="table.runName" />,
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
      title: <FormattedMessage id="table.runAlias" />,
      dataIndex: 'alias',
      sorter: (a: any, b: any) => {
        return a.alias > b.alias ? -1 : 1;
      },
      render: (dom, entity) => {
        if (entity.alias) {
          return (
            <Tooltip title={dom} placement="topLeft">
              {dom}
            </Tooltip>
          );
        }
        return false;
      },
    },
    {
      title: <FormattedMessage id="table.tags" />,
      dataIndex: 'tags',
      render: (dom, entity) => {
        if (entity?.tags) {
          return (
            <>
              {entity?.tags.map((item) => {
                return (
                  <Tag color="blue" key={item.toString()}>
                    {item}
                  </Tag>
                );
              })}
            </>
          );
        }
        return false;
      },
    },
    {
      title: 'RunId',
      dataIndex: 'id',
      hideInTable: true,
      render: (dom) => {
        return <Tag>{dom}</Tag>;
      },
    },
    {
      title: <FormattedMessage id="table.type" />,
      dataIndex: 'type',
      hideInSearch: true,
      render: (dom) => {
        return <Tag color="green">{dom}</Tag>;
      },
    },
    {
      title: 'Aird : Vendor(MB)',
      dataIndex: 'fileSize',
      hideInSearch: true,
      render: (dom, entity) => {
        const airdSize = (entity.airdSize + entity.airdIndexSize) / 1024 / 1024;
        const vendorSize = entity.vendorFileSize / 1024 / 1024;
        const deltaRatio = `${(((vendorSize - airdSize) / vendorSize) * 100).toFixed(1)}%`;

        return (
          <>
            <Tag color="blue">{airdSize.toFixed(0)}</Tag>
            <Tag color="blue">{vendorSize.toFixed(0)}</Tag>
            <Tag color="green">{deltaRatio}</Tag>
          </>
        );
      },
    },
    {
      title: <FormattedMessage id="table.windowRanges" />,
      dataIndex: 'windowRanges',
      hideInSearch: true,
      render: (dom, entity) => {
        if (entity?.windowRanges) {
          return (
            <>
              <Tag color="blue">{entity?.windowRanges.length}</Tag>
              <Link
                to={{
                  pathname: '/blockIndex',
                  search: `?runId=${entity.id}`,
                  state: { projectId, projectName, runName: entity.name },
                }}
              >
                <Tag color="green">
                  <FormattedMessage id="table.check" />
                </Tag>
              </Link>
            </>
          );
        }
        return false;
      },
    },
    {
      title: <FormattedMessage id="table.irtVerRes" />,
      dataIndex: 'irt',
      hideInSearch: true,
      render: (dom, entity) => {
        if (entity.irt) {
          return <Tag color="green">{entity.irt.si.formula}</Tag>;
        }
        return (
          <Tag color="red">
            <FormattedMessage id="table.unAnalyzed" />
          </Tag>
        );
      },
    },
    {
      title: <FormattedMessage id="table.fragmentMode" />,
      dataIndex: 'fragMode',
      hideInSearch: true,
      // render: (dom, entity) => {
      //   if (entity.irt) {
      //     return <Tag color="green">{entity.irt.si.formula}</Tag>;
      //   }
      //   return <Tag color="red">未分析</Tag>;
      // },
    },
    {
      title: <FormattedMessage id="table.option" />,
      valueType: 'option',
      fixed: 'right',
      width: '240px',
      hideInSearch: true,
      render: (dom, entity) => (
        <>
          <a
            onClick={() => {
              formUpdate?.resetFields();
              handleUpdateModalVisible(true);
              setCurrentRow(entity);
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
              setCurrentRow(entity);
              setShowDetail(true);
            }}
            key="details"
          >
            <Tag color="blue">
              <Icon style={{ verticalAlign: '-4px', fontSize: '16px' }} icon="mdi:file-document" />
              <FormattedMessage id="table.detail" />
            </Tag>
          </a>
          <Link
            to={{
              pathname: '/overView',
              state: { projectName, runName: entity.name },
              search: `?runId=${entity.id}&projectId=${projectId}`,
            }}
            key="overView"
          >
            <Tag color="green">
              <Icon
                style={{ verticalAlign: '-4px', fontSize: '16px' }}
                icon="mdi:format-list-bulleted-square"
              />
              <FormattedMessage id="table.overview" />
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
        headerTitle={
          props?.location?.state?.projectName === undefined ? (
            <>
              <Text>
                <FormattedMessage id="table.runList" />
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
                  <FormattedMessage id="table.projectList" />
                </Text>
              </Link>
              &nbsp;&nbsp;/&nbsp;&nbsp;
              <a>
                <Text>
                  <FormattedMessage id="table.runList" /> <FormattedMessage id="table.belongPro" />
                  ：{projectName}
                </Text>
              </a>
              &nbsp;&nbsp;
              <Link
                to={{
                  pathname: '/overview',
                  state: { projectName, projectId },
                  search: `?projectId=${projectId}`,
                }}
              >
                <Button type="primary" size="small">
                  <FormattedMessage id="table.switchOv" />
                </Button>
              </Link>
            </>
          )
        }
        actionRef={actionRef}
        search={{ labelWidth: 'auto', span: 4 }}
        rowKey="id"
        size="small"
        pagination={{
          pageSize: 100,
          hideOnSinglePage: true,
          size: 'small',
          showSizeChanger: false,
          showQuickJumper: false,
          showTotal: () => null,
          position: ['bottomRight'],
        }}
        tableAlertRender={false}
        request={async (params) => {
          const result = await prepare(projectId);
          if (result.success) {
            setPrepareData(result.data);
          }
          const msg = await runList({ projectId, ...params });
          return Promise.resolve(msg);
        }}
        toolBarRender={() => [
          <a
            onClick={async () => {
              setProteinSelectVisible(true);
              const msg = await getProteins({ projectId });
              setProteinList(msg.data);
            }}
            key="edit"
          >
            <Tag color="blue">
              <Icon style={{ verticalAlign: '-4px', fontSize: '16px' }} icon="mdi:file-document" />
              <FormattedMessage id="table.interfereFactor" />
            </Tag>
          </a>,
          <a
            onClick={() => {
              if (selectedRows?.length > 0) {
                handleAnalyzeModalVisible(true);
              } else {
                const msg = intl.formatMessage({
                  id: 'message.analysisRun',
                  defaultMessage: '请选择要分析的Run',
                });
                message.warn(msg);
              }
            }}
            key="scan"
          >
            <Tag color="blue">
              <Icon style={{ verticalAlign: '-4px', fontSize: '16px' }} icon="mdi:calculator" />
              <FormattedMessage id="table.startAna" />
            </Tag>
          </a>,
          <>
            {selectedRows && selectedRows.length > 0 ? (
              <a
                key="alias"
                onClick={() => {
                  if (selectedRows?.length > 0) {
                    setBatchEditVisible(true);
                  }
                }}
              >
                <Tag color="blue">
                  <Icon style={{ verticalAlign: '-4px', fontSize: '16px' }} icon="mdi:table-edit" />
                  <FormattedMessage id="table.batchEdit" />
                </Tag>
              </a>
            ) : (
              <a
                onClick={() => {
                  const msg = intl.formatMessage({
                    id: 'message.least1Run',
                    defaultMessage: '至少选择一个Run！',
                  });
                  message.warn(msg);
                }}
                key="alias"
              >
                <Tag color="blue">
                  <Icon style={{ verticalAlign: '-4px', fontSize: '16px' }} icon="mdi:table-edit" />
                  <FormattedMessage id="table.batchEdit" />
                </Tag>
              </a>
            )}
          </>,
          <>
            {selectedRows && selectedRows.length > 0 ? (
              <a
                key="alias"
                onClick={() => {
                  if (selectedRows?.length > 0) {
                    handleAliasModalVisible(true);
                  }
                }}
              >
                <Tag color="blue">
                  <Icon
                    style={{ verticalAlign: '-4px', fontSize: '16px' }}
                    icon="mdi:drama-masks"
                  />
                  <FormattedMessage id="table.generateAlias" />
                </Tag>
              </a>
            ) : (
              <a
                onClick={() => {
                  const msg = intl.formatMessage({
                    id: 'message.least1Run',
                    defaultMessage: '至少选择一个Run！',
                  });
                  message.warn(msg);
                }}
                key="alias"
              >
                <Tag color="blue">
                  <Icon
                    style={{ verticalAlign: '-4px', fontSize: '16px' }}
                    icon="mdi:drama-masks"
                  />
                  <FormattedMessage id="table.generateAlias" />
                </Tag>
              </a>
            )}
          </>,
          <>
            {selectedRows && selectedRows.length > 0 ? (
              <Link
                key="IRT"
                to={{
                  pathname: '/irt/list',
                  search: `?runList=${selectedRows?.map((item) => {
                    return item.id;
                  })}`,
                  state: { projectId, runNum: selectedRows.length },
                }}
              >
                <Tag color="blue">
                  <Icon style={{ verticalAlign: '-4px', fontSize: '16px' }} icon="mdi:chart-line" />
                  <FormattedMessage id="table.checkIrt" />
                </Tag>
              </Link>
            ) : (
              <a
                onClick={() => {
                  const msg = intl.formatMessage({
                    id: 'message.least1Run',
                    defaultMessage: '至少选择一个Run！',
                  });
                  message.warn(msg);
                }}
                key="IRT"
              >
                <Tag color="blue">
                  <Icon style={{ verticalAlign: '-4px', fontSize: '16px' }} icon="mdi:chart-line" />
                  <FormattedMessage id="table.checkIrt" />
                </Tag>
              </a>
            )}
          </>,
        ]}
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

      {selectedRows && selectedRows.length ? (
        <AnalyzeForm
          form={formAnalyze}
          onCancel={() => {
            handleAnalyzeModalVisible(false);
            formAnalyze?.resetFields();
          }}
          onSubmit={async (value: AnalyzeParams) => {
            value.runIdList = selectedRows.map((e) => e.id);
            value.projectId = projectId;
            const success = await analyze(value);
            if (success) {
              handleAnalyzeModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          analyzeModalVisible={analyzeModalVisible}
          values={{ runNum: selectedRows.length, prepareData }}
        />
      ) : null}

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

      <ProteinSelectForm
        proteinSelectVisible={proteinSelectVisible}
        values={proteinList}
        onClose={() => {
          setCurrentRow(undefined);
          setProteinSelectVisible(false);
        }}
        onSubmit={async (value) => {
          const msg = await getPeptide({
            projectId,
            proteinName: value.proteinName,
            range: value.range,
          });
          setShowCharts(true);
          setChartData(msg.data);
          setProteinName(value.proteinName);
        }}
      />

      <ProteinFixedChartsForm
        showCharts={showCharts}
        chartsData={chartsData}
        proteinName={proteinName}
        onCancel={() => {
          setShowCharts(false);
          setChartData(undefined);
          setProteinName(undefined);
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
      {/* 批量编辑列表 */}
      <BatchEditForm
        form={formBatch}
        onCancel={() => {
          setBatchEditVisible(false);
          setCurrentRow(undefined);
          formBatch?.resetFields();
        }}
        onSubmit={async (value: {
          ids: string[];
          fragMode: string;
          group: string;
          tags: Set<string>;
        }) => {
          value.ids = selectedRows.map((row) => {
            return row.id;
          });
          const success = await batchEdit({
            ids: value.ids,
            fragMode: value.fragMode,
            group: value.group,
            tags: value.tags,
          });
          if (success) {
            setBatchEditVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        batchEditVisible={batchEditVisible}
        values={currentRow || {}}
      />
      {/* 生成别名 */}
      <AliasForm
        form={formAlias}
        onCancel={() => {
          handleAliasModalVisible(false);
          formUpdate?.resetFields();
        }}
        onSubmit={async (values: AliasParams) => {
          values.runIds = selectedRows.map((e) => e.id);
          const success = await handleAlias(values);
          if (success) {
            handleAliasModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        aliasModalVisible={aliasModalVisible}
      />
    </>
  );
};

export default TableList;
