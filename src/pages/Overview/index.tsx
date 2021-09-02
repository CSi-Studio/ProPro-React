import { Icon } from '@iconify/react';
import { Form, message, Tag, Tooltip, Typography } from 'antd';
import React, { useState, useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { batchUpdate, overviewList, overviewList2, removeList, updateList } from './service';
import type { TableListItem, TableListPagination } from './data';
import UpdateForm from './components/UpdateForm';
import { Link } from 'umi';
import DetailForm from './components/OverviewDetail';
import DeleteForm from './components/DeleteForm';
import BatchUpdateForm from './components/BatchUpdateForm';

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
/**
 * 批量修改
 * @param values
 */
const handleBatchUpdate = async (values: any) => {
  const hide = message.loading('正在更新');
  try {
    await batchUpdate({ ...values });
    hide();
    message.success('批量修改成功');
    return true;
  } catch (error) {
    hide();
    message.error('批量修改失败，请重试!');
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
  try {
    await removeList({
      overviewIds,
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
  const [formUpdate] = Form.useForm();
  const [formDelete] = Form.useForm();
  const [formBatch] = Form.useForm();
  const projectName = props?.location?.state?.projectName;
  const expName = props?.location?.state?.expName;

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
  /** 删除窗口的弹窗 */
  const [deleteModalVisible, handleDeleteModalVisible] = useState<boolean>(false);
  /** 批量修改窗口的弹窗 */
  const [batchModalVisible, handleBatchModalVisible] = useState<boolean>(false);

  const projectId = props?.location?.query?.projectId;
  const pjId = props?.location?.state?.projectId;
  const expId = props?.location?.state?.expId;

  const columns: ProColumns<TableListItem>[] = [
    {
      key: 'name',
      title: '概览名',
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
      key: 'defaultOne',
      title: '默认值',
      dataIndex: 'defaultOne',
      render: (text, entity) => {
        return text ? <Tag color="green">Yes</Tag> : <Tag color="red">No</Tag>;
      },
    },
    {
      key: 'peakCount',
      title: '峰统计',
      dataIndex: 'statstic',
      render: (text, entity) => {
        return entity?.statistic?.TOTAL_PEAK_COUNT;
      },
    },
    {
      key: 'peptideCount',
      title: '肽段统计',
      dataIndex: 'statstic',
      render: (text, entity) => {
        return entity?.statistic?.TOTAL_PEPTIDE_COUNT;
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
      key: 'note',
      title: '标注',
      dataIndex: 'note',
      hideInSearch: true,
      render: (dom, entity) => {
        if (entity.note) {
          return <Tag>{dom}</Tag>;
        }
        return false;
      },
    },
    {
      key: 'option',
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
          >
            <Tag color="blue">
              <Icon style={{ verticalAlign: 'middle', fontSize: '20px' }} icon="mdi:file-edit" />
              编辑
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
              详情
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
      <ProTable<TableListItem, TableListPagination>
        scroll={{ x: 'max-content' }}
        headerTitle={
          projectName === undefined ? (
            <>
              <Text>概要列表</Text>
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
              {expName === undefined ? (
                <a>
                  <Text>概要列表 所属项目：{projectName}</Text>
                </a>
              ) : (
                <>
                  <Link
                    to={{
                      pathname: '/experiment/list',
                      state: { projectName, projectId },
                      search: `?projectId=${props?.location?.state?.projectId}`,
                    }}
                  >
                    <Text type="secondary">实验列表</Text>
                  </Link>
                  &nbsp;&nbsp;/&nbsp;&nbsp;
                  <a>
                    <Text>概要列表 所属实验：{expName}</Text>
                  </a>
                </>
              )}
            </>
          )
        }
        actionRef={actionRef}
        rowKey="id"
        size="small"
        search={false}
        toolBarRender={() => [
          <a
            key="batchEdit"
            onClick={async () => {
              formBatch?.resetFields();
              if (selectedRows?.length > 0) {
                handleBatchModalVisible(true);
              } else {
                message.warn('请选择要修改的概要，支持多选');
              }
            }}
          >
            <Tag color="blue">
              <Icon style={{ verticalAlign: '-4px', fontSize: '16px' }} icon="mdi:delete" />
              批量修改
            </Tag>
          </a>,
          <a
            key="delete"
            onClick={async () => {
              formDelete?.resetFields();
              if (selectedRows?.length > 0) {
                handleDeleteModalVisible(true);
              } else {
                message.warn('请选择要删除的概要，支持多选');
              }
            }}
          >
            <Tag color="error">
              <Icon style={{ verticalAlign: '-4px', fontSize: '16px' }} icon="mdi:delete" />
              删除
            </Tag>
          </a>,
        ]}
        tableAlertRender={false}
        pagination={{
          total: total,
        }}
        request={async (params) => {
          if (projectId) {
            const msg = await overviewList({ projectId: projectId, ...params });
            setTotal(msg.totalNum);
            return Promise.resolve(msg);
          } else {
            const msg = await overviewList2({ projectId: pjId, expId: expId, ...params });
            setTotal(msg.totalNum);
            return Promise.resolve(msg);
          }
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
          var mapvalue = {
            id: value.id,
            tags: value.tags,
            note: value.note,
            defaultOne: value.defaultOne,
          };
          const success = await handleUpdate(mapvalue);
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
          if (value.name === '我确认删除') {
            const success = await handleRemove(selectedRows);
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
      />
      <BatchUpdateForm
        form={formBatch}
        onCancel={() => {
          handleBatchModalVisible(false);
          setSelectedRows([]);
          formBatch?.resetFields();
        }}
        onSubmit={async (value) => {
          var mapValue = {
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
      ></BatchUpdateForm>
    </>
  );
};

export default TableList;
