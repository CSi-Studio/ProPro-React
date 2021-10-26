import { Form, message, Tooltip, Tag, Space, Table, Typography, Row, Col } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { peptideList, predictPeptide, removeList, updateFragment, updateList } from './service';
import type { TableListItem, TableListPagination } from './data';
import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { Icon } from '@iconify/react';
import DeleteForm from './components/DeleteForm';
import type { updateFormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import DetailForm from './components/DetailForm';
import type { predictFormValueType } from './components/PredictForm';
import PredictForm from './components/PredictForm';
import ContrastList from './components/ContrastList';
import { Link } from 'umi';

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
 * 删除库
 * @param currentRow
 */
const handleRemove = async (currentRow: TableListItem | undefined) => {
  if (!currentRow) return true;
  try {
    await removeList({
      peptideId: currentRow.id,
    });
    message.success('删除成功，希望你不要后悔 🥳');
    return true;
  } catch (error) {
    message.error('删除失败，请重试');
    return false;
  }
};
const { Text } = Typography;
const TableList: React.FC = (props: any) => {
  /** 全选 */
  const [selectedRows, setSelectedRows] = useState<TableListItem[]>([]);
  /** 删除窗口的弹窗 */
  const [formDelete] = Form.useForm();
  const [deleteModalVisible, handleDeleteModalVisible] = useState<boolean>(false);
  /** 更新窗口的弹窗 */
  const [formUpdate] = Form.useForm();
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  /** 预测肽段碎片的弹窗 */
  const [formPredict] = Form.useForm();
  const [predictModalVisible, handlePredictModalVisible] = useState<boolean>(false);
  /** 对比肽段碎片的弹窗 */
  const [formContrast] = Form.useForm();
  const [contrastModalVisible, handleContrastModalVisible] = useState<boolean>(false);
  const [total, setTotal] = useState<any>();
  /** 库详情的抽屉 */
  const [showDetail, setShowDetail] = useState<boolean>(false);
  /** 预测弹窗 */
  const [predictList, setPredictList] = useState<any>();

  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const actionRef = useRef<ActionType>();

  const { libraryId } = props?.location?.query;

  /**
   * 预测肽段碎片
   * @param values
   */
  const handlePredict = async (values: predictFormValueType) => {
    const hide = message.loading('正在预测肽段碎片');
    try {
      const predictData = await predictPeptide({ ...values });
      setPredictList(predictData);
      hide();
      message.success('预测肽段碎片完成');
      handleContrastModalVisible(true);
      return true;
    } catch (error) {
      hide();
      message.error('预测失败，请重试!');
      return false;
    }
  };
  /**
   * 预测对比
   * @param values
   */
  const handleContrast = async (value: { fragments: any[] }) => {
    const hide = message.loading('正在加载');
    value.fragments.map((item: any) => {
      item.predict = null;
      delete item.key;
      return true;
    });

    try {
      await updateFragment({ peptideId: currentRow?.id }, value.fragments);
      hide();
      message.success('添加成功');
      return true;
    } catch (error) {
      hide();
      message.error('添加失败，请重试!');
      return false;
    }
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'disable',
      dataIndex: 'disable',
      width: 50,
      hideInSearch: true,
      sorter: (a, b) => {
        return a?.disable > b?.disable ? -1 : 1;
      },
      render: (dom, entity) => {
        return entity.disable ? <Tag color="red">失效</Tag> : <Tag color="green">有效</Tag>;
      },
    },
    {
      title: 'Proteins',
      dataIndex: 'proteins',
      render: (dom, entity) => {
        const pros: any[] = [];
        if (entity.proteins) {
          entity.proteins.forEach((pro) => {
            pros.push(<Tag key={pro}>{pro}</Tag>);
          });
        }
        return <Space direction="vertical">{pros}</Space>;
      },
    },
    {
      title: 'PeptideRef',
      dataIndex: 'peptideRef',
      render: (dom, entity) => {
        return (
          <Space direction="vertical">
            <Tag color="green">真:{entity.peptideRef}</Tag>
            <Tag color="red">伪:{entity.decoySequence}</Tag>
          </Space>
        );
      },
    },
    {
      title: 'm/z',
      dataIndex: 'mz',
      hideInSearch: true,
      sorter: (a, b) => {
        return a?.mz > b?.mz ? -1 : 1;
      },
    },
    {
      title: 'RT',
      dataIndex: 'rt',
      hideInSearch: true,
      sorter: (a, b) => {
        return a?.rt > b?.rt ? -1 : 1;
      },
    },
    {
      title: '离子片段',
      dataIndex: 'fragments',
      hideInSearch: true,
      children: [
        {
          title: 'CutInfo',
          dataIndex: 'cutInfo',
          hideInSearch: true,
          render: (dom, entity) =>
            entity.fragments.map((item) => {
              return (
                <Row>
                  <Col>{item.cutInfo}</Col>
                </Row>
              );
            }),
        },
        {
          title: '碎片荷质比',
          dataIndex: 'mz',
          hideInSearch: true,
          render: (dom, entity) =>
            entity.fragments.map((item) => {
              return (
                <Row>
                  <Col>{item.mz}</Col>
                </Row>
              );
            }),
        },
        {
          title: '强度',
          dataIndex: 'intensity',
          hideInSearch: true,
          render: (dom, entity) =>
            entity.fragments.map((item) => {
              return (
                <Row>
                  <Col>{item.intensity}</Col>
                </Row>
              );
            }),
        },
        {
          title: '带电量',
          dataIndex: 'charge',
          hideInSearch: true,
          render: (dom, entity) =>
            entity.fragments.map((item) => {
              return (
                <Row>
                  <Col>{item.charge}</Col>
                </Row>
              );
            }),
        },
        {
          title: 'Annotations',
          dataIndex: 'Annotations',
          hideInSearch: true,
          render: (dom, entity) =>
            entity.fragments.map((item) => {
              return (
                <Row>
                  <Col>{item.annotations}</Col>
                </Row>
              );
            }),
        },
        // {
        //   title: 'CutInfo',
        //   dataIndex: 'cutInfo',
        //   hideInSearch: true,
        //   render: (dom, entity) => [
        //     <Table
        //       showHeader={false}
        //       bordered={false}
        //       pagination={false}
        //       size="small"
        //       dataSource={entity.fragments}
        //       columns={[
        //         {
        //           dataIndex: 'cutInfo',
        //         },
        //       ]}
        //     />,
        //   ],
        // },
        // {
        //   title: '碎片荷质比',
        //   dataIndex: 'mz',
        //   hideInSearch: true,
        //   render: (dom, entity) => [
        //     <Table
        //       showHeader={false}
        //       bordered={false}
        //       pagination={false}
        //       size="small"
        //       dataSource={entity.fragments}
        //       columns={[
        //         {
        //           dataIndex: 'mz',
        //         },
        //       ]}
        //     />,
        //   ],
        // },
        // {
        //   title: '强度',
        //   dataIndex: 'intensity',
        //   hideInSearch: true,
        //   render: (dom, entity) => [
        //     <Table
        //       showHeader={false}
        //       bordered={false}
        //       pagination={false}
        //       size="small"
        //       dataSource={entity.fragments}
        //       columns={[
        //         {
        //           dataIndex: 'intensity',
        //         },
        //       ]}
        //     />,
        //   ],
        // },
        // {
        //   title: '带电量',
        //   dataIndex: 'charge',
        //   hideInSearch: true,
        //   render: (dom, entity) => [
        //     <Table
        //       showHeader={false}
        //       bordered={false}
        //       pagination={false}
        //       size="small"
        //       dataSource={entity.fragments}
        //       columns={[
        //         {
        //           dataIndex: 'charge',
        //         },
        //       ]}
        //     />,
        //   ],
        // },
        // {
        //   title: 'Annotations',
        //   dataIndex: 'Annotations',
        //   hideInSearch: true,
        //   render: (dom, entity) => [
        //     <Table
        //       showHeader={false}
        //       bordered={false}
        //       pagination={false}
        //       size="small"
        //       dataSource={entity.fragments}
        //       columns={[
        //         {
        //           dataIndex: 'annotations',
        //         },
        //       ]}
        //     />,
        //   ],
        // },
      ],
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
            key="detail"
          >
            <Tag color="blue">
              <Icon style={{ verticalAlign: '-4px', fontSize: '16px' }} icon="mdi:file-edit" />
              编辑
            </Tag>
          </a>
          <a
            onClick={() => {
              setCurrentRow(record);
              setShowDetail(true);
            }}
            key="detail"
          >
            <Tag color="blue">
              <Icon style={{ verticalAlign: '-4px', fontSize: '16px' }} icon="mdi:file-document" />
              详情
            </Tag>
          </a>
        </>
      ),
    },
  ];
  /* 行选择 */
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
          props?.location?.state?.libraryName === undefined ? (
            <>
              <Text>肽段列表</Text>
            </>
          ) : (
            <>
              <Link
                to={{
                  pathname: '/library/list',
                }}
              >
                <Text type="secondary">靶库</Text>
              </Link>
              &nbsp;&nbsp;/&nbsp;&nbsp;
              <a>
                <Text>肽段列表 所属库：{props?.location?.state?.libraryName}</Text>
              </a>
            </>
          )
        }
        actionRef={actionRef}
        search={{ labelWidth: 'auto' }}
        rowKey="id"
        size="small"
        pagination={{
          total: total,
        }}
        request={async (params) => {
          const msg = await peptideList({ libraryId, ...params });
          setTotal(msg.totalNum);
          return Promise.resolve(msg);
        }}
        tableAlertRender={false}
        columns={columns}
        onRow={(record, index) => {
          return {
            onClick: () => {
              selectRow(record);
            },
          };
        }}
        toolBarRender={() => [
          <a
            key="predict"
            onClick={() => {
              formPredict?.resetFields();
              if (selectedRows?.length > 0) {
                if (selectedRows.length == 1) {
                  handlePredictModalVisible(true);
                } else {
                  message.warn('目前只支持单个肽段的预测');
                  setSelectedRows([]);
                }
              } else {
                message.warn('请选择一个的肽段');
              }
            }}
          >
            <Tag color="blue">
              <Icon style={{ verticalAlign: '-4px', fontSize: '16px' }} icon="mdi:robot-dead" />
              预测肽段碎片
            </Tag>
          </a>,
          <a
            key="delete"
            onClick={() => {
              formDelete?.resetFields();
              handleDeleteModalVisible(true);
              if (selectedRows?.length > 0) {
                if (selectedRows.length == 1) {
                  handleDeleteModalVisible(true);
                } else {
                  message.warn('目前只支持单个肽段的删除');
                  setSelectedRows([]);
                }
              } else {
                message.warn('请选择一个的肽段');
              }
            }}
          >
            <Tag color="error">
              <Icon style={{ verticalAlign: '-4px', fontSize: '16px' }} icon="mdi:delete" />
              删除
            </Tag>
          </a>,
        ]}
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

      {/* 预测肽段碎片弹窗 */}
      <PredictForm
        form={formPredict}
        onCancel={() => {
          setSelectedRows([]);
          handlePredictModalVisible(false);
          formPredict?.resetFields();
        }}
        onSubmit={async (value) => {
          value.peptideId = selectedRows[0]?.id as string;
          const success = await handlePredict(value);
          if (success) {
            handlePredictModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        predictModalVisible={predictModalVisible}
        values={currentRow || {}}
      />
      {/* 预测对比弹窗 */}
      <ContrastList
        form={formContrast}
        onCancel={() => {
          handleContrastModalVisible(false);
          setSelectedRows([]);
          formContrast?.resetFields();
        }}
        onSubmit={async (value) => {
          const success = await handleContrast(value);
          if (success) {
            handleContrastModalVisible(false);
            setSelectedRows([]);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        contrastModalVisible={contrastModalVisible}
        values={selectedRows[0]}
        predictList={predictList}
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
          if (value.name === selectedRows[0]?.peptideRef) {
            const success = await handleRemove(selectedRows[0]);
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
        values={selectedRows[0] || {}}
      />
    </>
  );
};

export default TableList;
