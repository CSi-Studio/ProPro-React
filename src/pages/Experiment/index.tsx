import { Tag, Tooltip, Form, Button, message, Typography } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { experimentList, analyze, prepare, updateList, generateAlias } from './service';
import type { AnalyzeParams, PrepareAnalyzeVO, TableListItem, TableListPagination } from './data';
import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { Icon } from '@iconify/react';
import DetailForm from './components/DetailForm';
import AnalyzeForm from './components/AnalyzeForm';
import { Link } from 'umi';
import UpdateForm from './components/UpdateForm';

/**
 * 更新库
 * @param values
 */
const handleUpdate = async (values: any) => {
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

const { Text } = Typography;
const TableList: React.FC = (props: any) => {
  const [formAnalyze] = Form.useForm();
  const [formUpdate] = Form.useForm();
  /* 分析窗口变量 */
  const [analyzeModalVisible, handleAnalyzeModalVisible] = useState<boolean>(false);
  /* 编辑窗口变量 */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  /** 全选 */
  const [selectedRows, setSelectedRows] = useState<TableListItem[]>([]);
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  /** 库详情的抽屉 */
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [total, setTotal] = useState<any>();
  const actionRef = useRef<ActionType>();

  const [prepareData, setPrepareData] = useState<PrepareAnalyzeVO>();
  const projectId = props?.location?.query?.projectId;
  const projectName = props?.location?.state?.projectName;

  /**
   * 生成别名
   * @param values
   */
  const handleAlias = async (values: any[]) => {
    const hide = message.loading('正在生成');
    const expIds = values.map((item) => {
      return item;
    });
    console.log('expIds', expIds);
    try {
      await generateAlias({ expIds });
      hide();
      message.success('生成成功');
      if (actionRef.current) {
        actionRef.current.reload();
      }
      return true;
    } catch (error) {
      hide();
      message.error('生成失败，请重试!');
      return false;
    }
  };
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '实验名',
      dataIndex: 'name',
      render: (dom, entity) => {
        return (
          <Tooltip title={'Id:' + entity.id} placement="topLeft">
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
      title: '实验别名',
      dataIndex: 'alias',
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
      title: 'ExpId',
      dataIndex: 'id',
      hideInTable: true,
      render: (dom) => {
        return <Tag>{dom}</Tag>;
      },
    },
    {
      title: '类型',
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
        const deltaRatio = (((vendorSize - airdSize) / vendorSize) * 100).toFixed(1) + '%';

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
      title: 'SWATH窗口',
      dataIndex: 'windowRanges',
      render: (dom, entity) => {
        if (entity?.windowRanges) {
          return (
            <>
              <Tag color="blue">{entity?.windowRanges.length}</Tag>
              <Link
                to={{
                  pathname: '/blockIndex',
                  search: `?expId=${entity.id}`,
                  state: { projectId, projectName, expName: entity.name },
                }}
              >
                <Tag color="green">查看</Tag>
              </Link>
            </>
          );
        }
        return false;
      },
    },
    {
      title: 'IRT校验结果',
      dataIndex: 'irt',
      render: (dom, entity) => {
        if (entity.irt) {
          return <Tag color="green">{entity.irt.si.formula}</Tag>;
        } else {
          return <Tag color="red">未分析</Tag>;
        }
      },
    },
    {
      title: '操作',
      valueType: 'option',
      fixed: 'right',
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
              编辑
            </Tag>
          </a>
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
            key="edit"
          >
            <Tag color="blue">
              <Icon style={{ verticalAlign: '-4px', fontSize: '16px' }} icon="mdi:file-document" />
              详情
            </Tag>
          </a>
          <Link
            to={{
              pathname: '/blockIndex',
              search: `?expId=${entity.id}`,
              state: { projectId, expName: entity.name },
            }}
            key="blockIndex"
          >
            <Tag color="blue">
              <Icon
                style={{ verticalAlign: '-4px', fontSize: '16px' }}
                icon="mdi:format-line-spacing"
              />
              索引
            </Tag>
          </Link>
          <Link
            to={{
              pathname: '/overView',
              state: { projectId: projectId, expId: entity.id },
              search: `?expId=${entity.id}?projectId=${projectId}`,
            }}
            key="overView"
          >
            <Tag color="green">分析概览</Tag>
          </Link>
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
      <ProTable<TableListItem, TableListPagination>
        scroll={{ x: 'max-content' }}
        headerTitle={
          props?.location?.state?.projectName === undefined ? (
            <>
              <Text>实验列表</Text>
            </>
          ) : (
            <>
              <Link
                to={{
                  pathname: '/project/list',
                }}
              >
                <Text type="secondary">项目列表</Text>
              </Link>
              &nbsp;&nbsp;/&nbsp;&nbsp;
              <a>
                <Text>实验列表 所属项目：{projectName}</Text>
              </a>
            </>
          )
        }
        actionRef={actionRef}
        search={{ labelWidth: 'auto' }}
        rowKey="id"
        size="small"
        pagination={{
          pageSize: 50,
        }}
        tableAlertRender={false}
        request={async (params) => {
          const result = await prepare(projectId);
          if (result.success) {
            setPrepareData(result.data);
          }
          const msg = await experimentList({ projectId, ...params });
          setTotal(msg.totalNum);
          return Promise.resolve(msg);
        }}
        toolBarRender={() => [
          <a
            onClick={() => {
              if (selectedRows?.length > 0) {
                handleAnalyzeModalVisible(true);
              } else {
                message.warn('请选择要分析的实验');
              }
            }}
            key="scan"
          >
            <Tag color="blue">
              <Icon style={{ verticalAlign: '-4px', fontSize: '16px' }} icon="mdi:calculator" />
              开始分析
            </Tag>
          </a>,
          <a
            key="scan"
            onClick={() => {
              if (selectedRows?.length > 0) {
                let expIds: any[] = [];
                selectedRows.map((item) => {
                  expIds.push(item.id);
                });
                console.log(expIds);

                handleAlias(expIds);
              } else {
                message.warn('请选择要生成的实验');
              }
            }}
          >
            <Tag color="blue">
              <Icon style={{ verticalAlign: '-4px', fontSize: '16px' }} icon="mdi:calculator" />
              生成别名
            </Tag>
          </a>,
          <>
            {selectedRows && selectedRows.length > 0 ? (
              <Link
                key="IRT"
                to={{
                  pathname: '/irt/list',
                  search: `?expList=${selectedRows?.map((item) => {
                    return item.id;
                  })}`,
                  state: { projectId, expNum: selectedRows.length },
                }}
              >
                <Tag color="blue">
                  <Icon style={{ verticalAlign: '-4px', fontSize: '16px' }} icon="mdi:chart-line" />
                  查看IRT
                </Tag>
              </Link>
            ) : (
              <a
                onClick={() => {
                  message.warn('至少选择一个实验 🔬');
                }}
                key="IRT"
              >
                <Tag color="blue">
                  <Icon style={{ verticalAlign: '-4px', fontSize: '16px' }} icon="mdi:chart-line" />
                  查看IRT
                </Tag>
              </a>
            )}
          </>,
        ]}
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

      {selectedRows && selectedRows.length ? (
        <AnalyzeForm
          form={formAnalyze}
          onCancel={() => {
            handleAnalyzeModalVisible(false);
            formAnalyze?.resetFields();
          }}
          onSubmit={async (value: AnalyzeParams) => {
            value.expIdList = selectedRows.map((e) => e.id);
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
          values={{ expNum: selectedRows.length, prepareData: prepareData }}
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
          console.log(value);

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
