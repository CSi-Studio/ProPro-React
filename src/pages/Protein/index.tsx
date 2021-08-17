import { Form, message, Tooltip } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { addList, proteinList } from './service';
import type { TableAddItem, TableListItem, TableListPagination } from './data';
import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import './index.less';
import CreateForm from './components/createForm';

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
const TableList: React.FC = (props) => {
  /** 全局弹窗 */
  // const [popup, setPopup] = useState<boolean>(false);
  /** 全选 */
  // const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>();

  const [formCreate] = Form.useForm();
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const [createRow, setCreateRow] = useState<TableAddItem>();
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '标识符',
      dataIndex: 'identifier',
      width: '100px',
      render: (dom, entity) => {
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
        return entity.reviewed ? '✅' : '❌';
      },
    },
    {
      title: '蛋白质名称',
      dataIndex: 'names',
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
    },
    {
      title: '基因🧬',
      dataIndex: 'gene',
    },
    {
      title: '序列号',
      dataIndex: 'sequence',
      render: (dom, entity) => {
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
              <a
                onClick={() => {
                  setCurrentRow(entity);
                }}
              >
                {dom}
              </a>
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: 'UniProt链接🔗',
      dataIndex: 'uniPortLink',
      render: (dom, entity) => {
        return (
          <a href={entity.uniPortLink ? entity.uniPortLink : 'http://www.csibio.net/'}>UniProt</a>
        );
      },
    },
    {
      title: 'alphaFoldLink链接🔗',
      dataIndex: 'alphaFoldLink',
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
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        scroll={{ x: 'max-content' }}
        size="small"
        headerTitle={
          props?.location?.state?.libraryName === undefined
            ? ''
            : props?.location?.state?.libraryName
        }
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        request={proteinList}
        // dataSource={tableListDataSource}
        columns={columns}
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
    </PageContainer>
  );
};

export default TableList;
