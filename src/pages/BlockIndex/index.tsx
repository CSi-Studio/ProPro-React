import { Button, Dropdown, Menu, message, Tag, Tooltip, Form } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { blockIndexDetail, blockIndexList} from './service';
import type { TableListDetail, TableListItem, TableListPagination,IdItem ,updateListItem,deleteListItem } from './data';
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
import DetailForm from './components/DetailForm';
import { Link } from 'umi';
// import UpdateForm from './components/updateDictItem';
// import AddForm from './components/CreateForm';
// import AddFormItem from './components/CreateItem';
// import DeleteFormItem from './components/DeleteForm';
// import DeleteDictForm from './components/DeleteDict';
// import './index.less';
// import DetailForm from './components/DetailForm';


// const handleAdd = async (values) => {
//   const hide = message.loading('正在添加');
//   try {
//     await addList(values );
//     hide();
//     message.success('添加成功');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('添加失败请重试！');
//     return false;
//   }
// };
// const handleAddItem = async (values) => {
//   const hide = message.loading('正在添加');
//   try {
//     await addListItem(values );
//     hide();
//     message.success('添加成功');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('添加失败请重试！');
//     return false;
//   }
// };
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
// const handleUpdate = async (values) => {
//   const hide = message.loading('正在更新');
//   try {
//     await updateList( values);
//     hide();
//     message.success('编辑成功');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('编辑失败，请重试!');
//     return false;
//   }
// };
// /**
//  * 删除库
//  * @param currentRow
//  */
// const handleRemoveItem = async (values) => {
//   try {
//     await deleteItem(values);
//     message.success('删除成功，即将刷新');
//     return true;
//   } catch (error) {
//     message.error('删除失败，请重试');
//     return false;
//   }
// };

// const handleRemove = async (values) => {
//   try {
//     await deleteDict(values);
//     message.success('删除成功，即将刷新');
//     return true;
//   } catch (error) {
//     message.error('删除失败，请重试');
//     return false;
//   }
// };


const TableList: React.FC = (props) => {
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
  const [idRow,setRowId] = useState<any>();
  const [detaileRow, setDetailRow] = useState<TableListDetail>();
  const [currentUpdate, setCurrentUpdate] = useState<updateListItem>();
  const [currentDeleteItem, setCurrentDeleteItem] = useState<deleteListItem>();
  const [currentDelete, setCurrentDelete] = useState<IdItem>();
  const [currenId, setId] = useState<IdItem>();
  const actionRef = useRef<ActionType>();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const { expId } = props?.location?.query;
  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'level',
      dataIndex: 'level',
      sorter: (a, b) => (a.level > b.level ? -1 : 1),
      // render: (dom, entity) => {
      //   return (
      //     <a
      //       onClick={() => {
      //         setCurrentRow(entity);
      //         setShowDetail(true);
      //         // setPopup(true);
      //       }}
      //     >
      //       {dom}
      //     </a>
      //   );
      // },
    },

    {
      title: '文件开始位置',
      dataIndex: 'startPtr',
      sorter: (a, b) => (a.startPtr > b.startPtr ? -1 : 1),
      // render: (dom, entity) => {
      //   return (
      //     <a
      //       onClick={() => {
      //         setCurrentRow(entity);
      //         setShowDetail(true);
      //         // setPopup(true);
      //       }}
      //     >
      //       {dom}
      //     </a>
      //   );
      // },
    },
    {
      title: '文件结束位置',
      dataIndex: 'endPtr',
      sorter: (a, b) => (a.endPtr > b.endPtr ? -1 : 1),
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
            console.log(idRow)
          }}
          key="detail"
        >
          <Icon style={{ verticalAlign: 'middle', fontSize: '20px' }} icon="mdi:file-document" />
        </a>
      </Tooltip>,
      ]
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
      // {
      //   title: 'range',
      //   dataIndex: 'range',
      //   // render: (dom: any, entity: any) => {
      //   //   return <span onClick={() => {}}>{entity?.startPtr}</span>;
      //   // },
      // },
      // {
      //   title: 'range',
      //   dataIndex:'range',
      //   render: (dom: any, entity: { range: Record<string, any>; }) => [
      //     <div
      //       style={{
      //         width: '600px',
      //         color: '#666666',
      //         display: 'flex',
      //         justifyContent: 'space-around',
      //       }}
      //     >
    
      //       <div
      //         key="1"
      //         style={{
      //           color: '#666666',
      //           display: 'flex',
      //           flexDirection: 'column',
      //           justifyContent: 'center',
      //         }}
      //       >
      //         start
      //           <div
      //             key={entity.range.start}
      //             style={{
      //               margin: 0,
      //             }}
      //           >
      //             <p
      //               style={{
      //                 margin: '0 2px',
      //                 width: '160px',
      //                 whiteSpace: 'nowrap',
      //                 overflow: 'hidden',
      //                 textOverflow: 'ellipsis',
      //               }}
      //             >
      //               {entity.range.start}
      //             </p>
      //           </div>
      //       </div>
      //       <div
      //         key="3"
      //         style={{
      //           color: '#666666',
      //           display: 'flex',
      //           flexDirection: 'column',
      //           justifyContent: 'center',
      //         }}
      //       >
      //         end
      //         <div
      //             key={entity.range.end}
      //             style={{
      //               margin: 0,
      //             }}
      //           >
      //             <p
      //               style={{
      //                 margin: '0 2px',
      //                 width: '160px',
      //                 whiteSpace: 'nowrap',
      //                 overflow: 'hidden',
      //                 textOverflow: 'ellipsis',
      //               }}
      //             >
      //               {entity.range.end}
      //             </p>
      //           </div>
      //       </div>
      //       <div
      //         key="4"
      //         style={{
      //           color: '#666666',
      //           display: 'flex',
      //           flexDirection: 'column',
      //           justifyContent: 'center',
      //           alignItems: 'center',
      //         }}
      //       >
      //         m/z
      //         <div
      //             key={entity.range.mz}
      //             style={{
      //               margin: 0,
      //             }}
      //           >
      //             <p
      //               style={{
      //                 margin: '0 2px',
      //                 width: '160px',
      //                 whiteSpace: 'nowrap',
      //                 overflow: 'hidden',
      //                 textOverflow: 'ellipsis',
      //               }}
      //             >
      //               {entity.range.mz}
      //             </p>
      //           </div>
      //       </div>
         
      //     </div>,
      //   ],
      // },

  ];








  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        scroll={{ x: 'max-content' }}
        headerTitle=""
        actionRef={actionRef}
        rowKey="id"
        size="small"
        // expandable={{
        //   expandedRowRender: (record) => (
        //     <ProTable
        //       columns={[
        //         { title: '键', dataIndex: 'key', key: 'key' },
        //         { title: '值', dataIndex: 'value', key: 'value' },
        //         {
        //           title: '操作',
        //           dataIndex: 'operation',
        //           key: 'operation',
        //           valueType: 'option',
        //           render: (text, record1) => [
        //             <Tooltip title={'编辑'} key="edit">
        //               <a
        //                 onClick={() => {
        //                   console.log('record', record);

        //                   formUpdate?.resetFields();
        //                   handleUpdateModalVisible(true);
        //                   let obj = {
        //                     id: record.id,
        //                     key: record1.key,
        //                     value: record1.value,
        //                   };
        //                   console.log('obj', obj);

        //                   setCurrentUpdate(obj);

        //                   // setPopup(true);
        //                 }}
        //                 key="edit"
        //               >
        //                 <EditFilled
        //                   style={{ verticalAlign: 'middle', fontSize: '15px', color: '#0D93F7' }}
        //                 />
        //               </a>
        //             </Tooltip>,
        //             <Tooltip title={'刪除'} key="deleteItem">
        //               <a
        //                 onClick={() => {
        //                   deleteDictForm?.resetFields();
        //                   handleDeleteModalVisible(true);
        //                   let odj = {
        //                     id: record.id,
        //                     key: record1.key,
        //                   };
        //                   console.log('odj', odj);

        //                   setCurrentDeleteItem(odj);

        //                   // setPopup(true);
        //                 }}
        //                 key="deleteItem"
        //               >
        //                 <DeleteTwoTone
        //                   style={{ verticalAlign: 'middle', fontSize: '15px', color: '#0D93F7' }}
        //                 />
        //               </a>
        //             </Tooltip>,
        //           ],
        //         },
        //       ]}
        //       headerTitle={false}
        //       search={false}
        //       options={false}
        //       dataSource={record.item}
        //       pagination={false}
        //     />
        //   ),
        //   rowExpandable: (record) => record.name !== 'Not Expandable',
        // }}
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          // <Button
          //   type="primary"
          //   key="primary"
          //   onClick={() => {
          //     form?.resetFields();
          //     handleModalVisible(true);
          //     // setPopup(true);
          //   }}
          // >
          //   <Icon style={{ verticalAlign: 'middle', fontSize: '20px' }} icon="mdi:playlist-plus" />
          //   新建字典表
          // </Button>,
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
