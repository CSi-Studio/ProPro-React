import { Tag, Tooltip } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import {experimentList } from './service';
import {connect} from 'dva';
import type { TableListItem, TableListPagination } from './data';
import router from 'umi/router';
import { routerRedux } from 'dva/router';
import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { Icon } from '@iconify/react';
import './index.less';
import DetailForm from './components/DetailForm';
import { values } from 'lodash';
import { Link } from 'umi';

// /**
//  * 添加库
//  * @param values
//  */
// const handleAdd = async (values: addFormValueType) => {
//   const hide = message.loading('正在添加');
//   try {
//     await addList({ ...values });
//     hide();
//     message.success('添加成功');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('添加失败请重试！');
//     return false;
//   }
// };


const TableList: React.FC = () => {
  // const [formCreate] = Form.useForm();
  // const [formUpdate] = Form.useForm();
  /** 全局弹窗 */
  // const [popup, setPopup] = useState<boolean>(false);
  /** 全选 */
  // const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>();

  /** 更新窗口的弹窗 */
  // const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  /** 库详情的抽屉 */
  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '标准库名称',
      dataIndex: 'name',
      copyable: true,
      width: '150px',
      render: (dom, entity) => {
        return (
          <Tooltip title={dom} color="#eeeeee" placement="topLeft">
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
                  setShowDetail(true);
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
      title: '实验类型',
      dataIndex: 'type',
      hideInSearch: true,
      render: (dom) => {
        return <Tag>{dom}</Tag>;
      },
    },
    {
      title: 'Aird Size',
      dataIndex: 'airdSize',
      valueType: 'digit',
      hideInSearch: true,
      render: (dom, entity) => {
        const size = entity.airdSize / 1024 / 1024;
        return <Tag color="green">{size.toFixed(0)}MB</Tag>;
      },
    },
    {
      title: 'Aird Index Size',
      dataIndex: 'airdIndexSize',
      hideInSearch: true,
      render: (dom, entity) => {
        const size = entity.airdSize / 1024 / 1024;
        return <Tag color="green">{size.toFixed(0)}MB</Tag>;
      },
    },
    {
      title: '厂商文件大小',
      dataIndex: 'vendorFileSize',
      hideInSearch: true,
      render: (dom, entity) => {
        const size = entity.airdSize / 1024 / 1024;
        return <Tag color="green">{size.toFixed(0)}MB</Tag>;
      },
    },
    {
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      hideInSearch: true,
      render: (text, record) => [
        <Tooltip title={'详情'} key="detail">
          <a
            onClick={() => {
              setCurrentRow(record);
              setShowDetail(true);
            }}
            key="edit"
          >
            <Icon style={{ verticalAlign: 'middle', fontSize: '20px' }} icon="mdi:file-document" />
          </a>
        </Tooltip>,
        <Tooltip title={'blockIndex'} key="blockIndex">
        <Link
          to={{
            pathname: '/blockIndex',
            search: `?expId=${record.id}`,
          }}
        >
          <Icon style={{ verticalAlign: 'middle', fontSize: '20px' }} icon="mdi:file-document" />
        </Link>
      </Tooltip>,
          
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        scroll={{ x: 'max-content' }}
        headerTitle=""
        actionRef={actionRef}
        rowKey="id"
        size="small"
        search={{
          labelWidth: 120,
        }}
        request={experimentList}
        columns={columns}
        rowSelection={
          {
            // onChange: (_, selectedRows) => {
            // setSelectedRows(selectedRows);
            // },
          }
        }
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
      {/* <UpdateForm
        form={formUpdate}
        onCancel={{
          onCancel: () => {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);
            formUpdate?.resetFields();
          },
        }}
        onSubmit={async (value) => {
          // eslint-disable-next-line no-param-reassign
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
      /> */}
    </PageContainer>
  );
};

export default TableList;
function handleClick() {
  throw new Error('Function not implemented.');
}

