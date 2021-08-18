import { Button, Dropdown, Menu, message, Tag, Tooltip, Form } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { blockIndexDetail, blockIndexList } from './service';
import type {
  TableListDetail,
  TableListItem,
  TableListPagination,
  IdItem,
  updateListItem,
  deleteListItem,
} from './data';
import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { Icon } from '@iconify/react';
import DetailForm from './components/DetailForm';
import { Link } from 'umi';

const TableList: React.FC = (props) => {
  /** 全局弹窗 */
  // const [popup, setPopup] = useState<boolean>(false);
  /** 全选 */
  // const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>();

  const [idRow, setRowId] = useState<any>();
  const [detaileRow, setDetailRow] = useState<TableListDetail>();

  const actionRef = useRef<ActionType>();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const { expId } = props?.location?.query.expId;
  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'level',
      dataIndex: 'level',
    },
    {
      title: '文件开始位置',
      dataIndex: 'startPtr',
    },
    {
      title: '文件结束位置',
      dataIndex: 'endPtr',
    },
    {
      title: 'range',
      dataIndex: 'range',
    },
    {
      title: '操作',
      valueType: 'option',
      copyable: true,
      width: 100,
      ellipsis: true,
      fixed: 'right',
      render: (text, record) => [
        <Tooltip title={'详情'} key="detail">
          <a
            onClick={() => {
              setRowId(record.id);
              setShowDetail(true);
              console.log(idRow);
            }}
            key="detail"
          >
            <Icon style={{ verticalAlign: 'middle', fontSize: '20px' }} icon="mdi:file-document" />
          </a>
        </Tooltip>,
      ],
    },
  ];

  const columnsNew = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '实验Id',
      dataIndex: 'expId',
    },
    {
      title: '等级',
      dataIndex: 'level',
    },
    {
      title: 'startPtr',
      dataIndex: 'startPtr',
    },
    {
      title: 'endPtr',
      dataIndex: 'endPtr',
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
        toolBarRender={() => [
          <Tooltip title={'blockIndex'} key="blockIndex">
            <Link
              to={{
                pathname: '/experiment/list',
              }}
            >
              返回实验列表
            </Link>
          </Tooltip>,
        ]}
        request={async (params) => {
          const msg = await blockIndexList({ expId, ...params });
          return Promise.resolve(msg);
        }}
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
        currentRow={idRow}
        columns={columnsNew}
        onClose={() => {
          setDetailRow(undefined);
          setShowDetail(false);
        }}
      />
      {/* ) : null} */}

      {/* 编辑列表 */}
      {/* <UpdateForm
        form={formUpdate}
        onSubmit={async (value) => {
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
        onCancel={{
          onCancel: () => {
            handleUpdateModalVisible(false);
            setCurrentUpdate(undefined);
            formUpdate?.resetFields();
            // setPopup(false);
          },
        }}
        updateModalVisible={updateModalVisible}
        values={currentUpdate || {}}
      /> */}

      {/* <AddForm
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
        values={currentRow || {}}
      /> */}

      {/* <AddFormItem
        form={formCreateItem}
        onCancel={{
          onCancel: () => {
            handleAddModalVisible(false);
            // setPopup(false);
            form?.resetFields();
          },
        }}
        onSubmit={async (value) => {
          const success = await handleAddItem(value);
          if (success) {
            handleAddModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        addModalVisible={addModalVisible}
        values={currenId || {}}
      /> */}

      {/* 删除DictItem */}
      {/* {popup ? ( */}
      {/* <DeleteFormItem
        form={deleteForm}
        onCancel={{
          onCancel: () => {
            handleDeleteModalVisible(false);
            setCurrentDeleteItem(undefined);
            deleteForm?.resetFields();
            // setPopup(false);
          },
        }}
        onSubmit={async () => {
          // handleDeleteModalVisible(false);
          const success = await handleRemoveItem(currentDeleteItem);
          if (success) {
            handleDeleteModalVisible(false);
            setCurrentDeleteItem(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        deleteModalVisible={deleteModalVisible}
        values={currentDeleteItem || {}}
      /> */}

      {/* 删除Dict */}
      {/* {popup ? ( */}
      {/* <DeleteDictForm
        form={deleteDictForm}
        onCancel={{
          onCancel: () => {
            handleDeleteDictModalVisible(false);
            setCurrentDelete(undefined);
            deleteDictForm?.resetFields();
            // setPopup(false);
          },
        }}
        onSubmit={async () => {
          // handleDeleteModalVisible(false);
          const success = await handleRemove(currentDelete);
          console.log('currentdelete', currentDelete);
          if (success) {
            handleDeleteDictModalVisible(false);
            setCurrentDelete(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        deleteDictModalVisible={deleteDictModalVisible}
        values={currentDelete || {}}
      /> */}

      {/* ) : null} */}

      {/* 克隆列表 */}
      {/* {popup ? ( */}

      {/* <CloneForm
        form={form}
        onCancel={{
          onCancel: () => {
            handleCloneModalVisible(false);
            setCurrentRow(undefined);
            form?.resetFields();
            // setPopup(false);
          },
        }}
        onSubmit={async (params) => {
          const p: { id: any; newLibName: string; includeDecoy?: boolean } = {
            id: '',
            newLibName: '',
            includeDecoy: false,
          };
          p.id = currentRow?.id;
          p.newLibName = params.newLibName;
          p.includeDecoy = params.includeDecoy;

          const success = await handleClone(p);
          if (success) {
            handleCloneModalVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        cloneModalVisible={cloneModalVisible}
        values={currentRow || {}}
      /> */}
      {/* ) : null} */}
    </PageContainer>
  );
};

export default TableList;
