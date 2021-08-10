import { Button, Dropdown, Menu, message, Tag, Tooltip, Form } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { dictList ,updateList} from './service';
import type { TableListItem, TableListPagination } from './data';
import { EditFilled, CopyFilled } from '@ant-design/icons';
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

import UpdateDictItem from './components/updateDictItem';
// import './index.less';
// import DetailForm from './components/DetailForm';

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
const handleUpdate = async (values: updateFormValue) => {
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
// /**
//  * 删除库
//  * @param currentRow
//  */
// const handleRemove = async (currentRow: TableListItem | undefined) => {
//   if (!currentRow) return true;
//   try {
//     await removeList({
//       libraryIds: currentRow.id,
//     });
//     message.success('删除成功，即将刷新');
//     return true;
//   } catch (error) {
//     message.error('删除失败，请重试');
//     return false;
//   }
// };

const handleAdd = async () => {
  const hide = message.loading('正在添加');
  try {
    await dictList();
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

const TableList: React.FC = () => {
  const [form] = Form.useForm();
  /** 全局弹窗 */
  // const [popup, setPopup] = useState<boolean>(false);
  /** 全选 */
  // const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>();
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 删除窗口的弹窗 */
  const [deleteModalVisible, handleDeleteModalVisible] = useState<boolean>(false);
  /** 更新窗口的弹窗 */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  /** 克隆窗口的弹窗 */
  const [cloneModalVisible, handleCloneModalVisible] = useState<boolean>(false);
  /** 库详情的抽屉 */
  const [currentRow, setCurrentRow] = useState<TableListItem>();

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
        
        <Dropdown
          key="GeneratePseudopeptide"
          overlay={
            <Menu>
              <Menu.Item key="1">
                <Tooltip placement="left" title={'生成伪肽段(Shuffle)'} key="Shuffle">
                  <a
                    key="Shuffle"
                    onClick={() => {
                      setCurrentRow(record);
                      // setPopup(true);
                    }}
                  >
                    <Icon
                      style={{ verticalAlign: 'middle', fontSize: '20px', color: '#0D93F7' }}
                      icon="mdi:alpha-s-circle"
                    />
                  </a>
                </Tooltip>
              </Menu.Item>
              <Menu.Item key="2">
                <Tooltip placement="left" title={'生成伪肽段(Nico)'} key="Nico">
                  <a
                    key="Nico"
                    onClick={() => {
                      setCurrentRow(record);
                      // setPopup(true);
                    }}
                  >
                    <Icon
                      style={{ verticalAlign: 'middle', fontSize: '20px', color: '#0D93F7' }}
                      icon="mdi:alpha-n-circle"
                    />
                  </a>
                </Tooltip>
              </Menu.Item>
            </Menu>
          }
        >
          <Tooltip title={'生成伪肽段'} key="GeneratePseudopeptide">
            <Icon
              style={{ verticalAlign: 'middle', fontSize: '18px', color: '#0D93F7' }}
              icon="mdi:alpha-p-box"
            />
          </Tooltip>
        </Dropdown>,
        <TableDropdown
          key="TableDropdown"
          onSelect={() => {}}
          menus={[
            {
              key: 'menus1',
              name: (
                <Tooltip placement="left" title={'重新统计蛋白质与肽段的数目'} key="statistics">
                  <a
                    key="statistics"
                    onClick={() => {
                      setCurrentRow(record);
                      // setPopup(true);
                    }}
                  >
                    <Icon
                      style={{ verticalAlign: 'middle', fontSize: '18px', color: '#0D93F7' }}
                      icon="mdi:state-machine"
                    />
                  </a>
                </Tooltip>
              ),
            },
            {
              key: 'menus2',
              name: (
                <Tooltip placement="left" title={'删除'} key="delete">
                  <a
                    key="delete"
                    onClick={async () => {
                      form?.resetFields();
                      handleDeleteModalVisible(true);
                      setCurrentRow(record);
                      // setPopup(true);
                    }}
                  >
                    <Icon
                      style={{ verticalAlign: 'middle', fontSize: '18px', color: '#0D93F7' }}
                      icon="mdi:delete"
                    />
                  </a>
                </Tooltip>
              ),
            },
          ]}
        />,
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
        expandable={{
          expandedRowRender: record =>  <ProTable
          columns={[
            { title: '键', dataIndex: 'key', key: 'key' },
            { title: '值', dataIndex: 'value', key: 'value' },
            {
              title: '操作',
              dataIndex: 'operation',
              key: 'operation',
              valueType: 'option',
              render: (text, record) => [
                <Tooltip title={'编辑'} key="edit">
          <a
            onClick={() => {
              form?.resetFields();
              handleUpdateModalVisible(true);
              setCurrentRow(record.item);
              // setPopup(true);
            }}
            key="edit"
          >
            <EditFilled style={{ verticalAlign: 'middle', fontSize: '15px', color: '#0D93F7' }} />
          </a>
        </Tooltip>,
              ]
            },
          ]}
          headerTitle={false}
          search={false}
          options={false}
          dataSource={record.item}
          pagination={false}
        />,
          rowExpandable: record => record.name !== 'Not Expandable',
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
            创建库
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

      {/* 新建列表 */}
      {/* {popup ? ( */}
      {/* <CreateForm
        form={form}
        onCancel={{
          onCancel: () => {
            handleModalVisible(false);
            // setPopup(false);
            form?.resetFields();
          },
        }}
        onSubmit={async (value: addFormValueType) => {
          const success = await handleAdd(value as addFormValueType);
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
      {/* ) : null} */}

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
      <UpdateDictItem
      onSubmit={async (value) => {
        // eslint-disable-next-line no-param-reassign
        // value.id = currentRow?.id as string;
        // value.key = currentRow?.key;
        // value.description = currentRow?.description;
        // const success = await handleUpdate(value);
        // if (success) {
        //   handleUpdateModalVisible(false);
        //   setCurrentRow(undefined);
        //   if (actionRef.current) {
        //     actionRef.current.reload();
        //   }
        // }
        console.log("value",value)
      }}
      onCancel={{
        onCancel: () => {
          handleDeleteModalVisible(false);
          setCurrentRow(undefined);
          form?.resetFields();
          // setPopup(false);
        },
      }}
      updateModalVisible= {updateModalVisible}
      values= {currentRow || {}}
      form={form}
      />

      {/* 删除列表 */}
      {/* {popup ? ( */}
      {/* <DeleteForm
        form={form}
        onCancel={{
          onCancel: () => {
            handleDeleteModalVisible(false);
            setCurrentRow(undefined);
            form?.resetFields();
            // setPopup(false);
          },
        }}
        onSubmit={async () => {
          // handleDeleteModalVisible(false);
          const success = await handleRemove(currentRow);
          if (success) {
            handleDeleteModalVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        deleteModalVisible={deleteModalVisible}
        values={currentRow || {}}
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
