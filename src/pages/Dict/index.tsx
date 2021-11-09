import { message, Form, Tag } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import {
  dictList,
  updateList,
  addList,
  addListItem,
  deleteItem,
  deleteDict,
  getDict,
  updateDictTable,
} from './service';
import type {
  TableListItem,
  TableListPagination,
  IdItem,
  updateListItem,
  deleteListItem,
} from './data';
import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { Icon } from '@iconify/react';
import DictForm from './components/DictForm';
import UpdateForm from './components/UpdateDictItem';
import AddForm from './components/CreateForm';
import AddFormItem from './components/CreateItem';
import DeleteFormItem from './components/DeleteForm';
import DeleteDictForm from './components/DeleteDict';
import UpdateTableForm from './components/UpdateDictTable';
import { useIntl, FormattedMessage } from 'umi';

const TableList: React.FC = () => {
  const intl = useIntl();

  const handleAdd = async (values: { name: string }) => {
    const hide = message.loading(
      `${intl.formatMessage({
        id: 'message.adding',
        defaultMessage: '正在添加...',
      })}`,
    );
    try {
      await addList(values);
      hide();
      message.success(
        `${intl.formatMessage({
          id: 'message.addSuccess',
          defaultMessage: '添加成功！',
        })}`,
      );
      return true;
    } catch (error) {
      hide();
      message.error(
        `${intl.formatMessage({
          id: 'message.addFail',
          defaultMessage: '添加失败，请重试！',
        })}`,
      );
      return false;
    }
  };
  const handleAddItem = async (values: { id: string; key: string; value: string }) => {
    const hide = message.loading(
      `${intl.formatMessage({
        id: 'message.adding',
        defaultMessage: '正在添加...',
      })}`,
    );
    try {
      await addListItem(values);
      hide();
      message.success(
        `${intl.formatMessage({
          id: 'message.addSuccess',
          defaultMessage: '添加成功！',
        })}`,
      );
      return true;
    } catch (error) {
      hide();
      message.error(
        `${intl.formatMessage({
          id: 'message.addFail',
          defaultMessage: '添加失败，请重试！',
        })}`,
      );
      return false;
    }
  };

  /**
   * 更新库
   * @param values
   */
  const handleUpdate = async (values: any) => {
    const hide = message.loading(
      `${intl.formatMessage({
        id: 'message.updating',
        defaultMessage: '正在更新...',
      })}`,
    );
    try {
      await updateList(values);
      hide();
      message.success(
        `${intl.formatMessage({
          id: 'message.editSuccess',
          defaultMessage: '编辑成功！',
        })}`,
      );
      sessionStorage.clear();
      const data = await getDict();
      data.data.forEach((item: any) => {
        sessionStorage.setItem(item.name, JSON.stringify(item.item));
      });

      return true;
    } catch (error) {
      hide();
      message.error(
        `${intl.formatMessage({
          id: 'message.editFail',
          defaultMessage: '编辑失败，请重试！',
        })}`,
      );
      return false;
    }
  };
  /**
   * 删除库
   * @param currentRow
   */
  const handleRemoveItem = async (values: any) => {
    try {
      await deleteItem(values);
      message.success(
        `${intl.formatMessage({
          id: 'message.deleteSuccess',
          defaultMessage: '删除成功！',
        })}`,
      );
      sessionStorage.clear();
      const data = await getDict();
      data.data.forEach((item: any) => {
        sessionStorage.setItem(item.name, JSON.stringify(item.item));
      });
      return true;
    } catch (error) {
      message.error(
        `${intl.formatMessage({
          id: 'message.deleteFail',
          defaultMessage: '删除失败，请重试！',
        })}`,
      );
      return false;
    }
  };

  const handleRemove = async (values: any) => {
    try {
      await deleteDict(values);
      message.success(
        `${intl.formatMessage({
          id: 'message.deleteSuccess',
          defaultMessage: '删除成功！',
        })}`,
      );
      const data = await getDict();
      data.data.forEach((item: any) => {
        sessionStorage.setItem(item.name, JSON.stringify(item.item));
      });
      return true;
    } catch (error) {
      message.error(
        `${intl.formatMessage({
          id: 'message.deleteFail',
          defaultMessage: '删除失败，请重试！',
        })}`,
      );
      return false;
    }
  };

  const reFreshCache = async () => {
    sessionStorage.clear();
    const data = await getDict();

    data.data.forEach((item: any) => {
      sessionStorage.setItem(item.name, JSON.stringify(item.item));
    });
    message.info(
      `${intl.formatMessage({
        id: 'message.refreshCache',
        defaultMessage: '刷新缓存成功',
      })}`,
    );
  };
  const [form] = Form.useForm();
  const [formUpdate] = Form.useForm();
  const [formUpdateTable] = Form.useForm();
  const [formCreate] = Form.useForm();
  const [formCreateItem] = Form.useForm();
  const [deleteForm] = Form.useForm();
  const [deleteDictForm] = Form.useForm();

  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 删除窗口的弹窗 */
  const [deleteModalVisible, handleDeleteModalVisible] = useState<boolean>(false);
  const [deleteDictModalVisible, handleDeleteDictModalVisible] = useState<boolean>(false);
  /** 更新窗口的弹窗 */
  const [addModalVisible, handleAddModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [updateTableVisible, handleUpdateTableVisible] = useState<boolean>(false);
  const [total, setTotal] = useState<any>();
  /** 库详情的抽屉 */
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const [currentUpdate, setCurrentUpdate] = useState<updateListItem>();
  const [currentUpdateTable, setCurrentUpdateTable] = useState<any>();
  const [currentDeleteItem, setCurrentDeleteItem] = useState<deleteListItem>();
  const [currentDelete, setCurrentDelete] = useState<IdItem>();
  const [currenId, setId] = useState<IdItem>();
  const actionRef = useRef<ActionType>();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const columns: ProColumns<TableListItem>[] = [
    {
      title: <FormattedMessage id="table.difName" />,
      dataIndex: 'name',
      showSorterTooltip: false,
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
      title: <FormattedMessage id="table.description" />,
      dataIndex: 'desc',
    },
    {
      title: <FormattedMessage id="table.option" />,
      valueType: 'option',
      fixed: 'right',
      width: '240px',
      render: (text, record) => (
        <>
          <a
            onClick={() => {
              formUpdateTable?.resetFields();
              handleUpdateTableVisible(true);
              setCurrentUpdateTable(record);
            }}
            key="edit"
          >
            <Tag color="blue">
              <Icon style={{ verticalAlign: '-4px', fontSize: '16px' }} icon="mdi:file-edit" />
              <FormattedMessage id="table.edit" />
            </Tag>
          </a>
          <a
            onClick={() => {
              formCreateItem?.resetFields();
              handleAddModalVisible(true);
              const objItem = {
                id: record.id,
              };
              setId(objItem);
            }}
            key="add"
          >
            <Tag color="green">
              <Icon
                style={{ verticalAlign: 'middle', fontSize: '20px' }}
                icon="mdi:playlist-plus"
              />
              <FormattedMessage id="table.addKey" />
            </Tag>
          </a>
          <a
            onClick={() => {
              deleteDictForm?.resetFields();
              handleDeleteDictModalVisible(true);
              const objId = {
                id: record.id,
              };
              setCurrentDelete(objId);
            }}
            key="delete"
          >
            <Tag color="error">
              <Icon style={{ verticalAlign: '-4px', fontSize: '16px' }} icon="mdi:delete" />
              <FormattedMessage id="table.delete" />
            </Tag>
          </a>
        </>
      ),
    },
  ];

  return (
    <>
      <ProTable<TableListItem, TableListPagination>
        scroll={{ x: 'max-content' }}
        headerTitle=""
        actionRef={actionRef}
        search={{ labelWidth: 'auto' }}
        rowKey="id"
        size="small"
        tableAlertRender={false}
        pagination={{
          total,
        }}
        expandable={{
          expandedRowRender: (record) => (
            <ProTable
              columns={[
                { title: 'key', dataIndex: 'key', key: 'key' },
                { title: 'value', dataIndex: 'value', key: 'value' },
                {
                  title: <FormattedMessage id="table.option" />,
                  dataIndex: 'operation',
                  key: 'operation',
                  valueType: 'option',
                  render: (text, record1) => (
                    <>
                      <a
                        onClick={() => {
                          formUpdate?.resetFields();
                          handleUpdateModalVisible(true);
                          const obj = {
                            id: record.id,
                            key: record1.key,
                            value: record1.value,
                          };
                          setCurrentUpdate(obj);
                        }}
                        key="edit"
                      >
                        <Tag color="blue">
                          <Icon
                            style={{ verticalAlign: '-4px', fontSize: '16px' }}
                            icon="mdi:file-edit"
                          />
                          <FormattedMessage id="table.edit" />
                        </Tag>
                      </a>
                      <a
                        onClick={() => {
                          deleteDictForm?.resetFields();
                          handleDeleteModalVisible(true);
                          const odj = {
                            id: record.id,
                            key: record1.key,
                          };
                          setCurrentDeleteItem(odj);
                        }}
                        key="deleteItem"
                      >
                        <Tag color="error">
                          <Icon
                            style={{ verticalAlign: '-4px', fontSize: '16px' }}
                            icon="mdi:delete"
                          />
                          <FormattedMessage id="table.delete" />
                        </Tag>
                      </a>
                    </>
                  ),
                },
              ]}
              headerTitle={false}
              search={false}
              options={false}
              dataSource={record.item}
              pagination={false}
              tableAlertRender={false}
            />
          ),
          rowExpandable: (record) => record.name !== 'Not Expandable',
        }}
        toolBarRender={() => [
          <a key="add">
            <Tag
              color="green"
              onClick={() => {
                form?.resetFields();
                handleModalVisible(true);
              }}
            >
              <Icon
                style={{ verticalAlign: 'middle', fontSize: '20px' }}
                icon="mdi:playlist-plus"
              />
              <FormattedMessage id="table.addDict" />
            </Tag>
          </a>,
          <a
            key="refresh"
            color="green"
            onClick={() => {
              reFreshCache();
            }}
          >
            <Tag color="blue">
              <Icon style={{ verticalAlign: '-4px', fontSize: '16px' }} icon="mdi:refresh-circle" />
              <FormattedMessage id="table.refreshCache" />
            </Tag>
          </a>,
        ]}
        request={async (params) => {
          const msg = await dictList({ ...params });
          setTotal(msg.totalNum);
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
      <DictForm
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
        onCancel={() => {
          handleUpdateModalVisible(false);
          setCurrentUpdate(undefined);
          formUpdate?.resetFields();
        }}
        updateModalVisible={updateModalVisible}
        values={currentUpdate || {}}
      />

      <AddForm
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
        values={currentRow || {}}
      />

      <AddFormItem
        form={formCreateItem}
        onCancel={() => {
          handleAddModalVisible(false);
          form?.resetFields();
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
      <DeleteFormItem
        form={deleteForm}
        onCancel={() => {
          handleDeleteModalVisible(false);
          setCurrentDeleteItem(undefined);
          deleteForm?.resetFields();
        }}
        onSubmit={async () => {
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
        values={currentDeleteItem}
      />

      {/* 删除Dict */}

      <DeleteDictForm
        form={deleteDictForm}
        onCancel={() => {
          handleDeleteDictModalVisible(false);
          setCurrentDelete(undefined);
          deleteDictForm?.resetFields();
        }}
        onSubmit={async () => {
          const success = await handleRemove(currentDelete);
          if (success) {
            handleDeleteDictModalVisible(false);
            setCurrentDelete(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        deleteDictModalVisible={deleteDictModalVisible}
        values={currentDelete}
      />

      <UpdateTableForm
        updateModalVisible={updateTableVisible}
        form={formUpdateTable}
        onCancel={() => {
          handleUpdateTableVisible(false);
          formUpdateTable?.resetFields();
        }}
        onSubmit={async (value) => {
          const success = await updateDictTable({ id: currentUpdateTable.id, desc: value?.desc });
          if (success) {
            handleUpdateTableVisible(false);
            setCurrentUpdateTable(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        values={currentUpdateTable}
      />
    </>
  );
};

export default TableList;
