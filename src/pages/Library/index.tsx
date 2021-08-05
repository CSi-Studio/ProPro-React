/* eslint-disable no-console */
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import { Button, Drawer, Dropdown, Menu, message, Tag, Tooltip } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { libraryList, addList, cloneList, removeList, updateList } from './service';
import type { TableListItem, TableListPagination } from './data';
import ProDescriptions from '@ant-design/pro-descriptions';
import { EditFilled, CopyFilled } from '@ant-design/icons';
import { TableDropdown } from '@ant-design/pro-table';
import type { addFormValueType } from './components/CreateForm';
import CreateForm from './components/CreateForm';
import type { updateFormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import DeleteForm from './components/DeleteForm';
import type { cloneFormValueType } from './components/cloneForm';
import CloneForm from './components/cloneForm';
import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { Icon } from '@iconify/react';
import './index.less';

/**
 * 添加库
 * @param values
 */
const handleAdd = async (values: addFormValueType) => {
  const hide = message.loading('正在添加');
  try {
    await addList({ ...values });
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
 * 克隆库
 * @param values
 */
const handleClone = async (values: cloneFormValueType) => {
  const hide = message.loading('正在添加');
  try {
    await cloneList(values);
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败，请重试！');
    return false;
  }
};
/**
 * 更新库
 * @param values
 */
const handleUpdate = async (values: updateFormValueType) => {
  const hide = message.loading('正在更新');
  try {
    console.log(values);

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
/**
 * 删除库
 * @param currentRow
 */
const handleRemove = async (currentRow: TableListItem | undefined) => {
  if (!currentRow) return true;
  try {
    console.log(currentRow);

    await removeList({
      libraryIds: currentRow.id,
    });
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList: React.FC = () => {
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 删除窗口的弹窗 */
  const [deleteModalVisible, handleDeleteModalVisible] = useState<boolean>(false);
  /** 更新窗口的弹窗 */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  /** 克隆窗口的弹窗 */
  const [cloneModalVisible, handleCloneModalVisible] = useState<boolean>(false);
  /** 库详情的抽屉 */
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>();
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
              console.log(entity);

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
      title: '伪肽段生成算法',
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
      title: '有机物种',
      dataIndex: 'organism',
      sorter: (a, b) => (a.organism > b.organism ? -1 : 1),
      render: (dom) => {
        return <Tag>{dom}</Tag>;
      },
    },
    {
      title: '蛋白质数目',
      dataIndex: 'Protein_Count',
      sorter: (a, b) => (a?.statistic?.Protein_Count > b?.statistic?.Protein_Count ? -1 : 1),
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              console.log(entity);
            }}
          >
            {entity?.statistic?.Protein_Count}
          </a>
        );
      },
    },
    {
      title: '肽段数目',
      dataIndex: 'Peptide_Count',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              console.log(entity);
            }}
          >
            {entity?.statistic?.Peptide_Count}
          </a>
        );
      },
    },
    {
      title: '碎片数目',
      dataIndex: 'Fragment_Count',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              console.log(entity?.statistic?.Fragment_Count);
            }}
          >
            {entity?.statistic?.Fragment_Count}
          </a>
        );
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
      render: (text, record) => [
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
        <Tooltip title={'克隆'} key="copy">
          <a
            key="copy"
            onClick={() => {
              handleCloneModalVisible(true);
              setCurrentRow(record);
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
                      setCurrentRow(record);
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
                      setCurrentRow(record);
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
      <CreateForm
        onCancel={{
          onCancel: () => handleModalVisible(false),
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
          onCancel: () => {
            handleUpdateModalVisible(false);

            setCurrentRow(undefined);
          },
        }}
        onSubmit={async (values) => {
          values.id = currentRow?.id;
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
          onCancel: () => {
            handleDeleteModalVisible(false);
            setCurrentRow(undefined);
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
      />
      {/* 克隆列表 */}
      <CloneForm
        onCancel={{
          onCancel: () => {
            handleCloneModalVisible(false);
            setCurrentRow(undefined);
          },
        }}
        onSubmit={async (params) => {
          const p: { id?: string; newLibName: string; includeDecoy?: boolean } = {
            id: '',
            newLibName: '',
            includeDecoy: false,
          };
          p.id = currentRow?.id;
          p.newLibName = params.newLibName;
          p.includeDecoy = params.includeDecoy;
          console.log(p);

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
      />
    </PageContainer>
  );
};

export default TableList;
