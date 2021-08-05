import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import { Button, Drawer, Dropdown, Menu, message, Tag, Tooltip } from 'antd';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { libraryList, addRule, updateRule, removeRule } from './service';
import type { TableListItem, TableListPagination } from './data';
import type { FormValueType } from './components/UpdateForm';
import ProDescriptions from '@ant-design/pro-descriptions';
import { EditFilled, CopyFilled } from '@ant-design/icons';
import { TableDropdown } from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import DeleteForm from './components/DeleteForm';
import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { Icon } from '@iconify/react';
import './index.less';

/**
 * 添加节点
 *
 * @param values
 */
const handleAdd = async (values: FormValueType) => {
  const hide = message.loading('正在添加');
  // eslint-disable-next-line no-console
  try {
    await addRule({ ...values });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};
/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('editing');
  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    });
    hide();
    message.success('Configuration is successful');
    return true;
  } catch (error) {
    hide();
    message.error('Configuration failed, please try again!');
    return false;
  }
};
/**
 * 删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: TableListItem[]) => {
  if (!selectedRows) return true;
  if (selectedRows.length === 0) {
    message.error('请选择要删除的库');
  } else {
    try {
      await removeRule({
        libraryIds: selectedRows.map((row) => row.id),
      });
      message.success('删除成功，即将刷新');
      return true;
    } catch (error) {
      message.error('删除失败，请重试');
      return false;
    }
  }
};

const TableList: React.FC = () => {
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 删除窗口的弹窗 */
  const [deleteModalVisible, handleDeleteModalVisible] = useState<boolean>(false);
  /** 更新窗口的弹窗 */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  /** 库详情的抽屉 */
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);
  const [currentRow, setCurrentRow] = useState<TableListItem>();

  const actionRef = useRef<ActionType>();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '标准库名称',
      dataIndex: 'name',
      sorter: (a, b) => (a.name > b.name ? -1 : 1),
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '库类型',
      dataIndex: 'type',
      sorter: (a, b) => (a.type > b.type ? -1 : 1),
      render: (dom) => {
        // eslint-disable-next-line array-callback-return
        return <Tag>{dom}</Tag>;
      },
    },
    {
      title: 'Generator',
      dataIndex: 'generator',
      sorter: (a, b) => (a.generator > b.generator ? -1 : 1),
      filters: true,
      onFilter: true,
      valueEnum: {
        shuffle: {
          text: 'shuffle',
        },
        nice: {
          text: 'nice',
        },
      },
      render: (dom) => {
        return <Tag>{dom}</Tag>;
      },
    },
    {
      title: '描述信息',
      dataIndex: 'description',
      sorter: (a, b) => (a.description > b.description ? -1 : 1),
      render: (dom) => {
        return <a>{dom}</a>;
      },
    },
    {
      title: '有机生物',
      dataIndex: 'organism',
      sorter: (a, b) => (a.organism > b.organism ? -1 : 1),
      render: (dom) => {
        return <Tag>{dom}</Tag>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      sorter: (a, b) => (a.createDate > b.createDate ? -1 : 1),
      valueType: 'dateTime',
    },
    {
      title: '操作',
      valueType: 'option',
      copyable: true,
      width: 100,
      ellipsis: true,
      fixed: 'right',
      render: (text, record, index, action) => [
        <Tooltip title={'编辑'} key="edit">
          <a
            onClick={() => {
              handleUpdateModalVisible(true);
              setCurrentRow(record);
            }}
            key="edit"
          >
            <EditFilled style={{ verticalAlign: 'middle', fontSize: '15px', color: '#0D93F7' }} />
          </a>
        </Tooltip>,
        <Tooltip title={'复制'} key="copy">
          <a
            key="copy"
            onClick={() => {
              action?.startEditable?.(record.id);
            }}
          >
            <CopyFilled style={{ verticalAlign: 'middle', fontSize: '15px', color: '#0D93F7' }} />
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
                      action?.startEditable?.(record.id);
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
                      action?.startEditable?.(record.id);
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
                      action?.startEditable?.(record.id);
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
                      handleDeleteModalVisible(true);
                      // setSelectedRows([]);
                      // actionRef.current?.reloadAndRest?.();
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
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <Icon style={{ verticalAlign: 'middle', fontSize: '20px' }} icon="mdi:playlist-plus" />
            创建库
          </Button>,
        ]}
        request={libraryList}
        // dataSource={tableListDataSource}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />

      {/* 新建列表 */}
      <CreateForm1
        onCancel={{
          onCancel: () => handleModalVisible(false),
        }}
        onSubmit={async (value: FormValueType) => {
          const success = await handleAdd(value as FormValueType);
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
      {/* 列表详情 */}
      <Drawer
        width={800}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<TableListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<TableListItem>[]}
          />
        )}
      </Drawer>
      {/* 编辑列表 */}
      <UpdateForm
        onCancel={{
          onCancel: () => handleUpdateModalVisible(false),
        }}
        onSubmit={async (values) => {
          // handleUpdateModalVisible(false);
          const success = await handleUpdate(values);
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
        onCancel={{
          onCancel: () => handleDeleteModalVisible(false),
        }}
        onSubmit={async () => {
          // handleDeleteModalVisible(false);
          const success = await handleRemove(selectedRowsState);
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
      />
    </PageContainer>
  );
};

export default TableList;
