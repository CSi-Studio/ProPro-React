import { Button, Form, message, Tag, Tooltip } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { addList, proteinList } from './service';
import type { TableAddItem, TableListItem, TableListPagination } from './data';
import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import { Icon } from '@iconify/react';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

/**
 * 添加库
 */
const handleAdd = async (values: any) => {
  const hide = message.loading('正在添加');
  try {
    await addList(values);
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};
const TableList: React.FC = (props: any) => {
  /** 全局弹窗 */
  // const [popup, setPopup] = useState<boolean>(false);
  /** 全选 */
  // const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>();
  const [total, setTotal] = useState<any>();
  const [formCreate] = Form.useForm();
  // const [currentRow, setCurrentRow] = useState<TableListItem>();
  const [createRow, setCreateRow] = useState<TableAddItem>();
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '标识符',
      dataIndex: 'identifier',
      width: '100px',
      render: (dom) => {
        return (
          <Tooltip title={dom} placement="topLeft">
            <div
              style={{
                width: '150px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {dom}
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: '审核与否',
      dataIndex: 'reviewed',
      hideInSearch: true,
      render: (dom, entity) => {
        return entity.reviewed ? (
          <Tag icon={<CheckCircleOutlined />} color="success">
            已审核
          </Tag>
        ) : (
          <Tag icon={<CloseCircleOutlined />} color="error">
            未审核
          </Tag>
        );
      },
    },
    {
      title: '蛋白质名称',
      dataIndex: 'names',
      hideInSearch: true,
      render: (dom) => {
        return (
          <Tooltip title={dom} placement="topLeft">
            <div
              style={{
                width: '150px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {dom}
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: '有机生物',
      dataIndex: 'organism',
      hideInSearch: true,
    },
    {
      title: '基因🧬',
      dataIndex: 'gene',
      hideInSearch: true,
    },
    {
      title: '序列号',
      dataIndex: 'sequence',
      hideInSearch: true,
      render: (dom) => {
        return (
          <Tooltip title={dom} placement="topLeft">
            <div
              style={{
                width: '150px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {dom}
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: 'UniProt链接🔗',
      dataIndex: 'uniPortLink',
      hideInSearch: true,
      render: (dom, entity) => {
        return (
          <a href={entity.uniProtLink ? entity.uniProtLink : 'http://www.csibio.net/'}>UniProt</a>
        );
      },
    },
    {
      title: 'alphaFoldLink链接🔗',
      dataIndex: 'alphaFoldLink',
      hideInSearch: true,
      render: (dom, entity) => {
        return (
          <a href={entity.alphaFoldLink ? entity.alphaFoldLink : 'http://www.csibio.net/'}>
            AlphaFold
          </a>
        );
      },
    },
  ];
  return (
    <>
      <ProTable<TableListItem, TableListPagination>
        scroll={{ x: 'max-content' }}
        size="small"
        headerTitle={
          props?.location?.state?.libraryName === undefined
            ? '蛋白列表'
            : props?.location?.state?.libraryName
        }
        actionRef={actionRef}
        rowKey="id"
        tableAlertRender={false}
        request={async (params) => {
          const msg = await proteinList({ ...params });
          setTotal(msg.totalNum);
          return Promise.resolve(msg);
        }}
        // dataSource={tableListDataSource}
        columns={columns}
        pagination={{
          total: total,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              formCreate?.resetFields();
              handleModalVisible(true);
              // setPopup(true);
            }}
          >
            <Icon style={{ verticalAlign: 'middle', fontSize: '20px' }} icon="mdi:playlist-plus" />
            导入蛋白库
          </Button>,
        ]}
        rowSelection={
          {
            // onChange: (_, selectedRows) => {
            // setSelectedRows(selectedRows);
            // },
          }
        }
      />
      {/* 添加列表 */}
      <CreateForm
        form={formCreate}
        onCancel={{
          onCancel: () => {
            handleModalVisible(false);
            // setPopup(false);
            formCreate?.resetFields();
          },
        }}
        onSubmit={async (value) => {
          const success = await handleAdd(value);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        createModalVisible={createModalVisible}
        values={createRow || {}}
      />
    </>
  );
};

export default TableList;
