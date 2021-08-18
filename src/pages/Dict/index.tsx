import { Button, Dropdown, Menu, message, Tag, Tooltip, Form } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { dictList ,updateList,addList,addListItem,deleteItem,deleteDict} from './service';
import type { DictList, TableListItem, TableListPagination,IdItem ,updateListItem,deleteListItem } from './data';
import { EditFilled, CopyFilled, StepBackwardOutlined, PlusCircleTwoTone, DeleteTwoTone } from '@ant-design/icons';
import { TableDropdown } from '@ant-design/pro-table';
// import type { addFormValueType } from './components/CreateForm';
// import CreateForm from './components/CreateForm';
import type { updateFormValue} from './components/updateDictItem';
// import DeleteForm from './components/DeleteForm';
// import type { cloneFormValueType } from './components/cloneForm';
// import CloneForm from './components/cloneForm';
import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { Icon } from '@iconify/react';
import DictForm from './components/DictForm';

import UpdateForm from './components/updateDictItem';
import AddForm from './components/CreateForm';
import AddFormItem from './components/CreateItem';
import DeleteFormItem from './components/DeleteForm';
import DeleteDictForm from './components/DeleteDict';
// import './index.less';
// import DetailForm from './components/DetailForm';


const handleAdd = async (values) => {
  const hide = message.loading('正在添加');
  try {
    await addList(values );
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};
const handleAddItem = async (values) => {
  const hide = message.loading('正在添加');
  try {
    await addListItem(values );
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};
// /**
//  * 克隆库
//  * @param values
//  */
// const handleClone = async (values: cloneFormValueType) => {
//   const hide = message.loading('正在添加');
//   try {
//     await cloneList(values);
//     hide();
//     message.success('添加成功');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('添加失败，请重试！');
//     return false;
//   }
// };
// /**
//  * 更新库
//  * @param values
//  */
const handleUpdate = async (values) => {
  const hide = message.loading('正在更新');
  try {
    await updateList( values);
    hide();
    message.success('编辑成功');
    return true;
  } catch (error) {
    hide();
    message.error('编辑失败，请重试!');
    return false;
  }
};
// /**
//  * 删除库
//  * @param currentRow
//  */
const handleRemoveItem = async (values) => {
  try {
    await deleteItem(values);
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    message.error('删除失败，请重试');
    return false;
  }
};

const handleRemove = async (values) => {
  try {
    await deleteDict(values);
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    message.error('删除失败，请重试');
    return false;
  }
};

// const handleAdd = async () => {
//   const hide = message.loading('正在添加');
//   try {
//     await dictList();
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
  const [form] = Form.useForm();
  const [formUpdate] = Form.useForm();
  const [formCreate] = Form.useForm();
  const [formCreateItem] = Form.useForm();
  const [deleteForm] = Form.useForm();
  const [deleteDictForm] = Form.useForm();
  /** 全局弹窗 */
  // const [popup, setPopup] = useState<boolean>(false);
  /** 全选 */
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>();
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 删除窗口的弹窗 */
  const [deleteModalVisible, handleDeleteModalVisible] = useState<boolean>(false);
  const [deleteDictModalVisible, handleDeleteDictModalVisible] = useState<boolean>(false);
  /** 更新窗口的弹窗 */
  const [addModalVisible, handleAddModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  /** 克隆窗口的弹窗 */
  const [cloneModalVisible, handleCloneModalVisible] = useState<boolean>(false);
  /** 库详情的抽屉 */
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const [currentUpdate, setCurrentUpdate] = useState<updateListItem>();
  const [currentDeleteItem, setCurrentDeleteItem] = useState<deleteListItem>();
  const [currentDelete, setCurrentDelete] = useState<IdItem>();
  const [currenId, setId] = useState<IdItem>();
  const actionRef = useRef<ActionType>();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '字典名',
      dataIndex: 'name',
      sorter: (a, b) => (a.name > b.name ? -1 : 1),
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
              // setPopup(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '操作',
      valueType: 'option',
      copyable: true,
      width: 100,
      ellipsis: true,
      fixed: 'right',
      render: (text, record) => [
        <Tooltip title={'编辑'} key="edit">
          <a
            onClick={() => {
              form?.resetFields();
              handleUpdateModalVisible(true);
              setCurrentRow(record);
              // setPopup(true);
            }}
            key="edit"
          >
            <EditFilled style={{ verticalAlign: 'middle', fontSize: '15px', color: '#0D93F7' }} />
          </a>
        </Tooltip>,
        <Tooltip title={'新增'} key="add">
          <a
            onClick={() => {
              console.log('currentrecord',record)
              formCreateItem?.resetFields();
              handleAddModalVisible(true);
              let objItem={
                id:record.id,
              }
              setId(objItem)

              // setPopup(true);
            }}
            key="add"
          >

            <PlusCircleTwoTone style={{ verticalAlign: 'middle', fontSize: '15px', color: '#0D93F7' }} />
          </a>
        </Tooltip>,
        <Tooltip title={'刪除'} key="delete">
         <a
           onClick={() => {
             console.log('currentrecord',record)
             deleteDictForm?.resetFields();
             handleDeleteDictModalVisible(true);
             let objId={
               id:record.id,
             }
             setCurrentDelete(objId)

             // setPopup(true);
           }}
           key="delete"
         >

           <DeleteTwoTone style={{ verticalAlign: 'middle', fontSize: '15px', color: '#0D93F7' }} />
         </a>
       </Tooltip>,
      ]
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
        expandable={{
          expandedRowRender: (record) => (
            <ProTable
              columns={[
                { title: '键', dataIndex: 'key', key: 'key' },
                { title: '值', dataIndex: 'value', key: 'value' },
                {
                  title: '操作',
                  dataIndex: 'operation',
                  key: 'operation',
                  valueType: 'option',
                  render: (text, record1) => [
                    <Tooltip title={'编辑'} key="edit">
                      <a
                        onClick={() => {
                          console.log('record', record);

                          formUpdate?.resetFields();
                          handleUpdateModalVisible(true);
                          let obj = {
                            id: record.id,
                            key: record1.key,
                            value: record1.value,
                          };
                          console.log('obj', obj);

                          setCurrentUpdate(obj);

                          // setPopup(true);
                        }}
                        key="edit"
                      >
                        <EditFilled
                          style={{ verticalAlign: 'middle', fontSize: '15px', color: '#0D93F7' }}
                        />
                      </a>
                    </Tooltip>,
                    <Tooltip title={'刪除'} key="deleteItem">
                      <a
                        onClick={() => {
                          deleteDictForm?.resetFields();
                          handleDeleteModalVisible(true);
                          let odj = {
                            id: record.id,
                            key: record1.key,
                          };
                          console.log('odj', odj);

                          setCurrentDeleteItem(odj);

                          // setPopup(true);
                        }}
                        key="deleteItem"
                      >
                        <DeleteTwoTone
                          style={{ verticalAlign: 'middle', fontSize: '15px', color: '#0D93F7' }}
                        />
                      </a>
                    </Tooltip>,
                  ],
                },
              ]}
              headerTitle={false}
              search={false}
              options={false}
              dataSource={record.item}
              pagination={false}
            />
          ),
          rowExpandable: (record) => record.name !== 'Not Expandable',
        }}
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              form?.resetFields();
              handleModalVisible(true);
              // setPopup(true);
            }}
          >
            <Icon style={{ verticalAlign: 'middle', fontSize: '20px' }} icon="mdi:playlist-plus" />
            新建字典表
          </Button>,
        ]}
        request={dictList}
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

      {/* 列表详情 */}
      {/* {popup ? ( */}
      <DictForm
        showDetail={showDetail}
        currentRow={currentRow}
        columns={columns}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
          // setPopup(false);
        }}
      />
      {/* ) : null} */}

      {/* 编辑列表 */}
      <UpdateForm
        form={formUpdate}
        onSubmit={async (value) => {
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
          },
        }}
        updateModalVisible={updateModalVisible}
        values={currentUpdate || {}}
      />

      <AddForm
        form={formCreate}
        onCancel={{
          onCancel: () => {
            handleModalVisible(false);
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
      />

      <AddFormItem
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
      />

      {/* 删除DictItem */}
      {/* {popup ? ( */}
      <DeleteFormItem
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
      />

      {/* 删除Dict */}
      {/* {popup ? ( */}
      <DeleteDictForm
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
      />

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
