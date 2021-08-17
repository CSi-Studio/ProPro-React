import { Button, Dropdown, Menu, message, Tag, Tooltip, Form } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import {
  libraryList,
  addList,
  cloneList,
  removeList,
  updateList,
  generateDecoys,
  repeatCount,
  statistic,
} from './service';
import type { TableListItem, TableListPagination } from './data';
import type { addFormValueType } from './components/CreateForm';
import CreateForm from './components/CreateForm';
import type { updateFormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import DeleteForm from './components/DeleteForm';
import type { cloneFormValueType } from './components/CloneForm';
import CloneForm from './components/CloneForm';
import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { Icon } from '@iconify/react';
import './index.less';
import DetailForm from './components/DetailForm';
import { Link } from 'umi';

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
  const hide = message.loading('正在克隆');
  try {
    await cloneList(values);
    hide();
    message.success('克隆成功');
    return true;
  } catch (error) {
    hide();
    message.error('克隆失败，请重试！');
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
 * 生成伪肽段
 * @param values
 */
const handleGenerate = async (values: { libraryId: any; generator: string }) => {
  const hide = message.loading('正在生成伪肽段');
  try {
    await generateDecoys({ ...values });
    hide();
    message.success('生成伪肽段成功');
    return true;
  } catch (error) {
    hide();
    message.error('生成伪肽段失败，请重试!');
    return false;
  }
};
/**
 * 生成基本统计信息
 * @param values
 */
const handleStatistic = async (libraryId: string) => {
  const hide = message.loading('正在生成基本统计信息');
  try {
    await statistic(libraryId);
    hide();
    message.success('生成基本统计信息成功');
    return true;
  } catch (error) {
    hide();
    message.error('生成基本统计信息失败，请重试!');
    return false;
  }
};
/**
 * 统计肽段重复率
 * @param values
 */
const handleRepeatCount = async (libraryId: string) => {
  const hide = message.loading('正在统计肽段重复率');
  try {
    await repeatCount(libraryId);
    hide();
    message.success('统计肽段重复率成功');
    return true;
  } catch (error) {
    hide();
    message.error('统计肽段重复率失败，请重试!');
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
    await removeList({
      libraryIds: currentRow.id,
    });
    message.success('删除成功，希望你不要后悔 🥳');
    return true;
  } catch (error) {
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList: React.FC = () => {
  const [formCreate] = Form.useForm();
  const [formUpdate] = Form.useForm();
  const [formDelete] = Form.useForm();
  const [formClone] = Form.useForm();
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
                  // setPopup(true);
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
      title: '库类型',
      dataIndex: 'type',
      width: '100px',
      hideInSearch: true,
      // hideInSearch: true,
      sorter: (a, b) => (a.type > b.type ? -1 : 1),
      render: (dom) => {
        return (
          <Tooltip title={dom}>
            <Tag>{dom}</Tag>
          </Tooltip>
        );
      },
    },
    {
      title: '伪肽段生成算法',
      dataIndex: 'generator',
      width: '120px',
      hideInSearch: true,
      render: (dom, entity) => {
        if (
          entity.generator === 'undefined' ||
          entity.generator == null ||
          entity.generator === ''
        ) {
          return <span>啥也不是 --刘能</span>;
        }
        return <Tag>{dom}</Tag>;
      },
    },
    {
      title: '有机物种',
      width: '160px',
      hideInSearch: true,
      // copyable: true,1
      dataIndex: 'organism',
      sorter: (a, b) => (a.organism > b.organism ? -1 : 1),
      render: (dom, entity) => {
        if (entity.organism.length > 0) {
          return <Tag>{dom}</Tag>;
        }
        return <span>啥也不是 --刘能</span>;
      },
    },
    {
      title: '蛋白质数目',
      width: '120px',
      dataIndex: 'Protein_Count',
      hideInSearch: true,
      render: (dom, entity) => {
        return <span onClick={() => {}}>{entity?.statistic?.Protein_Count}</span>;
      },
    },
    {
      title: '肽段数目',
      width: '120px',
      dataIndex: 'Peptide_Count',
      hideInSearch: true,
      render: (dom, entity) => {
        return (
          <Link
            to={{
              pathname: `/peptide/list`,
              state: { libraryName: entity.name },
              search: `?libraryId=${entity.id}`,
            }}
          >
            {entity?.statistic?.Peptide_Count}
          </Link>
        );
      },
    },
    {
      title: '碎片数目',
      width: '120px',
      dataIndex: 'Fragment_Count',
      hideInSearch: true,
      render: (dom, entity) => {
        return <span onClick={() => {}}>{entity?.statistic?.Fragment_Count}</span>;
      },
    },
    {
      title: '创建时间',
      width: '150px',
      dataIndex: 'createDate',
      hideInSearch: true,
      sorter: (a, b) => (a.createDate > b.createDate ? -1 : 1),
      valueType: 'dateTime',
    },
    {
      title: '描述信息',
      dataIndex: 'description',
      hideInSearch: true,
      width: '300px',
      valueType: 'textarea',
      render: (dom, entity) => {
        if (
          entity.description === 'undefined' ||
          entity.description == null ||
          entity.description === ''
        ) {
          return (
            <Tooltip title="什么都不写，这是人干的事吗 😇" color="#108ee9" placement="topLeft">
              <p
                style={{
                  margin: 0,
                  width: '300px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                <span>什么都不写，这是人干的事吗 😇</span>
              </p>
            </Tooltip>
          );
        }
        return (
          <Tooltip title={entity.description} color="#108ee9" placement="topLeft">
            <p
              style={{
                margin: 0,
                width: '200px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              <span>{entity.description}</span>
            </p>
          </Tooltip>
        );
      },
    },
    {
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      hideInSearch: true,
      render: (text, record) => [
        <Tooltip title={'编辑'} key="edit">
          <a
            onClick={() => {
              formUpdate?.resetFields();
              handleUpdateModalVisible(true);
              setCurrentRow(record);
              // setPopup(true);
            }}
            key="edit"
          >
            <Icon style={{ verticalAlign: 'middle', fontSize: '20px' }} icon="mdi:file-edit" />
          </a>
        </Tooltip>,
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
        <Tooltip title={'克隆'} key="clone">
          <a
            key="clone"
            onClick={() => {
              formClone?.resetFields();
              handleCloneModalVisible(true);
              setCurrentRow(record);
            }}
          >
            <Icon style={{ verticalAlign: 'middle', fontSize: '20px' }} icon="mdi:content-copy" />
          </a>
        </Tooltip>,
        <Dropdown
          key="generateDecoys"
          overlay={
            <Menu>
              <Menu.Item key="1">
                <Tooltip placement="left" title={'Shuffle方法'} key="Shuffle">
                  <a
                    key="Shuffle"
                    onClick={() => {
                      const values = { libraryId: record.id, generator: 'shuffle' };
                      handleGenerate(values);
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
                <Tooltip placement="left" title={'Nico方法'} key="Nico">
                  <a
                    key="Nico"
                    onClick={() => {
                      const values = { libraryId: record.id, generator: 'nico' };
                      handleGenerate(values);
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
          <Tooltip title={'生成伪肽段'} key="generateDecoys">
            <Icon
              style={{ verticalAlign: 'middle', fontSize: '20px', color: '#0D93F7' }}
              icon="mdi:alpha-p-box"
            />
          </Tooltip>
        </Dropdown>,
        <Tooltip placement="left" title={'生成基本统计信息'} key="statistics">
          <a
            key="statistics"
            onClick={() => {
              handleStatistic(record.id);
              // setPopup(true);
            }}
          >
            <Icon
              style={{ verticalAlign: 'middle', fontSize: '20px', color: '#0D93F7' }}
              icon="mdi:file-chart"
            />
          </a>
        </Tooltip>,
        <Tooltip placement="left" title={'统计肽段重复率'} key="repeatCount">
          <a
            key="repeatCount"
            onClick={() => {
              handleRepeatCount(record.id);
              // setPopup(true);
            }}
          >
            <Icon
              style={{ verticalAlign: 'middle', fontSize: '20px', color: '#0D93F7' }}
              icon="mdi:file-percent"
            />
          </a>
        </Tooltip>,
        <Tooltip placement="left" title={'删除'} key="delete">
          <a
            key="delete"
            onClick={async () => {
              formDelete?.resetFields();
              handleDeleteModalVisible(true);
              setCurrentRow(record);
              // setPopup(true);
            }}
          >
            <Icon
              style={{ verticalAlign: 'middle', fontSize: '20px', color: '#0D93F7' }}
              icon="mdi:delete"
            />
          </a>
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
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              formCreate?.resetFields();
              handleModalVisible(true);
              // setPopup(true);
            }}
          >
            <Icon style={{ verticalAlign: 'middle', fontSize: '20px' }} icon="mdi:playlist-plus" />
            创建库
          </Button>,
        ]}
        request={libraryList}
        columns={columns}
        // rowSelection={{
        //   onChange: (_, selectedRows) => {
        //     // setSelectedRows(selectedRows);
        //   },
        // }}
      />

      {/* 新建列表 */}
      {/* {popup ? ( */}
      <CreateForm
        form={formCreate}
        onCancel={{
          onCancel: () => {
            handleModalVisible(false);
            // setPopup(false);
            formCreate?.resetFields();
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
      />
      {/* ) : null} */}

      {/* 列表详情 */}
      {/* {popup ? ( */}
      <DetailForm
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
        onCancel={{
          onCancel: () => {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);
            // setPopup(false);
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
      />

      {/* 删除列表 */}
      {/* {popup ? ( */}
      <DeleteForm
        currentRow={currentRow}
        form={formDelete}
        onCancel={{
          onCancel: () => {
            handleDeleteModalVisible(false);
            setCurrentRow(undefined);
            formDelete?.resetFields();
            // setPopup(false);
          },
        }}
        onSubmit={async (value) => {
          // handleDeleteModalVisible(false);
          if (value.name === currentRow?.name) {
            const success = await handleRemove(currentRow);
            if (success) {
              handleDeleteModalVisible(false);
              setCurrentRow(undefined);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          } else {
            message.error('你没有删除的决心，给👴🏻 爬');
          }
        }}
        deleteModalVisible={deleteModalVisible}
        values={currentRow || {}}
      />
      {/* ) : null} */}

      {/* 克隆列表 */}
      {/* {popup ? ( */}
      <CloneForm
        form={formClone}
        onCancel={{
          onCancel: () => {
            handleCloneModalVisible(false);
            setCurrentRow(undefined);
            formClone?.resetFields();
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
      />
    </PageContainer>
  );
};

export default TableList;
