import { Form, message, Tag, Tooltip } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { addList, proteinList } from './service';
import type { TableListItem, TableListPagination } from './data';
import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import { Icon } from '@iconify/react';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  FieldNumberOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import Sequence from './components/Sequence';

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
  /** 全选 */
  const [selectedRows, setSelectedRows] = useState<TableListItem[]>([]);
  const [total, setTotal] = useState<any>();
  const [formCreate] = Form.useForm();
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [sequenceVisible, handleSequenceVisible] = useState<boolean>(false);
  const [currentRow, handleCurrentRow] = useState<any>();
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '标识符',
      dataIndex: 'identifier',
      render: (dom) => {
        return (
          <Tooltip title={dom} placement="topLeft">
            {dom}
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
        return <Tag>{dom}</Tag>;
      },
    },

    {
      title: '基因',
      dataIndex: 'gene',
      hideInSearch: true,
      render: (dom) => {
        return (
          <>
            <Tag>{dom}</Tag>
          </>
        );
      },
    },

    {
      title: '有机生物',
      dataIndex: 'organism',
      hideInSearch: true,
      render: (dom) => {
        return (
          <a>
            <Tag color="geekblue">{dom}</Tag>
          </a>
        );
      },
    },
    {
      key: 'option',
      title: '更多',
      valueType: 'option',
      fixed: 'right',
      hideInSearch: true,
      width: '300px',
      render: (text, record) => (
        <>
          <a href={record?.uniProtLink} target="_blank">
            <Tag icon={<LinkOutlined />} color="green">
              UniProt
            </Tag>
          </a>
          <a href={record?.alphaFoldLink} target="_blank">
            <Tag icon={<LinkOutlined />} color="green">
              alphaFold
            </Tag>
          </a>
          <a
            onClick={() => {
              handleCurrentRow(record);
              handleSequenceVisible(true);
            }}
          >
            <Tag icon={<FieldNumberOutlined />} color="blue">
              序列号
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
        columns={columns}
        pagination={{
          total: total,
        }}
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
              导入蛋白库
            </Tag>
          </a>,
        ]}
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
      {/* 添加列表 */}
      <CreateForm
        form={formCreate}
        onCancel={() => {
          handleModalVisible(false);
          formCreate?.resetFields();
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
      />
      <Sequence
        currentRow={currentRow}
        onCancel={() => {
          handleSequenceVisible(false);
        }}
        onSubmit={async () => {
          handleSequenceVisible(false);
          if (actionRef.current) {
            actionRef.current.reload();
          }
        }}
        sequenceVisible={sequenceVisible}
      />
    </>
  );
};

export default TableList;
