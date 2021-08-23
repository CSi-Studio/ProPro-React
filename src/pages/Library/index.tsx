import { Dropdown, Menu, message, Tag, Tooltip, Form } from 'antd';
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
 * @param selectedRowsState
 */
const handleRemove = async (selectedRowsState: TableListItem[]) => {
  try {
    await removeList({
      libraryIds: selectedRowsState[0].id,
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
  /** 全选 */
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);
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
  const [pageSize,setPageSize] = useState<number>(20);
  const [pageNo,setPageSizeNo] = useState<any>(0);
  const [total,setTotal] = useState<any>();
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '标准库名称',
      dataIndex: 'name',
      copyable: true,
      render: (dom, entity) => {
        return (
          <Tooltip title={dom} color="#eeeeee" placement="topLeft">
            <a
              onClick={() => {
                setCurrentRow(entity);
                setShowDetail(true);
                // setPopup(true);
                
              }}
            >
              {dom}
            </a>
          </Tooltip>
        );
      },
    },
    {
      title: '库类型',
      dataIndex: 'type',
      sorter: (a, b) => (a.type > b.type ? -1 : 1),
      render: (dom) => {
        if (dom === 'ANA') {
          return <Tag color="green">{dom}</Tag>;
        }
        return <Tag color="blue">{dom}</Tag>;
      },
    },
    {
      title: '伪肽段算法',
      dataIndex: 'generator',
      hideInSearch: true,
      render: (dom, entity) => {
        if (
          entity.generator === 'undefined' ||
          entity.generator == null ||
          entity.generator === ''
        ) {
          return false;
        }
        if (dom === 'shuffle') {
          return <Tag color="green">{dom}</Tag>;
        }
        return <Tag color="blue">{dom}</Tag>;
      },
    },
    {
      title: '有机物种',
      hideInSearch: true,
      dataIndex: 'organism',
      sorter: (a, b) => (a.organism > b.organism ? -1 : 1),
      render: (dom, entity) => {
        if (entity.organism.length > 0) {
          return <Tag color="geekblue">{dom}</Tag>;
        }
        return <Tag>未设置</Tag>;
      },
    },
    {
      title: '蛋白质数目',
      dataIndex: 'Protein_Count',
      hideInSearch: true,
      render: (dom, entity) => {
        return <span onClick={() => {}}>{entity?.statistic?.Protein_Count}</span>;
      },
    },
    {
      title: '肽段数目',
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
      dataIndex: 'Fragment_Count',
      hideInSearch: true,
      render: (dom, entity) => {
        return <span onClick={() => {}}>{entity?.statistic?.Fragment_Count}</span>;
      },
    },
    // {
    //   title: '创建时间',
    //   width: '150px',
    //   dataIndex: 'createDate',
    //   hideInSearch: true,
    //   sorter: (a, b) => (a.createDate > b.createDate ? -1 : 1),
    //   valueType: 'dateTime',
    // },
    {
      title: '描述信息',
      dataIndex: 'description',
      hideInSearch: true,
      valueType: 'textarea',
      render: (dom, entity) => {
        if (
          entity.description === 'undefined' ||
          entity.description == null ||
          entity.description === ''
        ) {
          return <Tag>未描述</Tag>;
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
      width: '160px',
      hideInSearch: true,
      render: (text, record) => [
        <Tooltip title={'编辑'} key="edit">
          <a
            onClick={() => {
              formUpdate?.resetFields();
              handleUpdateModalVisible(true);
              setCurrentRow(record);
            }}
            key="edit"
          >
            <Tag color="blue">
              <Icon style={{ verticalAlign: '-4px', fontSize: '16px' }} icon="mdi:file-edit" />
              编辑
            </Tag>
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
            <Tag color="blue">
              <Icon style={{ verticalAlign: '-4px', fontSize: '16px' }} icon="mdi:file-document" />
              详情
            </Tag>
          </a>
        </Tooltip>,
      ],
    },
  ];
  return (
    <>
      <ProTable<TableListItem, TableListPagination>
        scroll={{ x: 'max-content' }}
        headerTitle="靶列表"
        actionRef={actionRef}
        rowKey="id"
        size="small"
        tableAlertRender={false}
        pagination={{
         total:total
        }}
        toolBarRender={() => [
          <Tooltip title={'新增'} key="add">
            <a>
              <Tag
                color="green"
                onClick={() => {
                  formClone?.resetFields();
                  handleModalVisible(true);
                }}
              >
                <Icon
                  style={{ verticalAlign: 'middle', fontSize: '20px' }}
                  icon="mdi:playlist-plus"
                />
                新增
              </Tag>
            </a>
          </Tooltip>,
          <Tooltip title={'克隆'} key="clone">
            <a
              onClick={() => {
                formClone?.resetFields();
                if (selectedRowsState?.length > 0) {
                  if (selectedRowsState.length == 1) {
                    handleCloneModalVisible(true);
                    setSelectedRows([]);
                  } else {
                    message.warn('目前只支持单个库的克隆');
                    setSelectedRows([]);
                  }
                } else {
                  message.warn('请选择要克隆的库');
                }
              }}
            >
              <Tag color="blue">
                <Icon style={{ verticalAlign: '-4px', fontSize: '16px' }} icon="mdi:content-copy" />
                克隆
              </Tag>
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
                        if (selectedRowsState?.length > 0) {
                          if (selectedRowsState.length == 1) {
                            const values = {
                              libraryId: selectedRowsState[0].id,
                              generator: 'shuffle',
                            };
                            handleGenerate(values);
                            setSelectedRows([]);
                          }
                          if (selectedRowsState.length > 1) {
                            message.warn('目前只支持单个库的伪肽段生成');
                            setSelectedRows([]);
                          }
                        } else {
                          message.warn('请先选择一个库');
                        }
                      }}
                    >
                      <Tag>
                        <Icon
                          style={{ verticalAlign: '-5px', fontSize: '16px', color: '#0D93F7' }}
                          icon="mdi:alpha-s-circle"
                        />
                        Shuffle方法
                      </Tag>
                    </a>
                  </Tooltip>
                </Menu.Item>
                <Menu.Item key="2">
                  <Tooltip placement="left" title={'Nico方法'} key="Nico">
                    <Tag>
                      <a
                        key="Nico"
                        onClick={() => {
                          if (selectedRowsState?.length > 0) {
                            if (selectedRowsState.length == 1) {
                              const values = {
                                libraryId: selectedRowsState[0].id,
                                generator: 'nico',
                              };
                              handleGenerate(values);
                              setSelectedRows([]);
                            }
                            if (selectedRowsState.length > 1) {
                              message.warn('目前只支持单个库的伪肽段生成');
                              setSelectedRows([]);
                            }
                          } else {
                            message.warn('请先选择一个库');
                          }
                        }}
                      >
                        <Icon
                          style={{ verticalAlign: '-5px', fontSize: '16px', color: '#0D93F7' }}
                          icon="mdi:alpha-n-circle"
                        />
                        Nico方法
                      </a>
                    </Tag>
                  </Tooltip>
                </Menu.Item>
              </Menu>
            }
          >
            <Tag color="blue">
              <Tooltip title={'生成伪肽段'} key="generateDecoys">
                <Icon
                  style={{ verticalAlign: '-5px', fontSize: '18px', color: '#0D93F7' }}
                  icon="mdi:alpha-p-box"
                />
                生成伪肽段
              </Tooltip>
            </Tag>
          </Dropdown>,
          <Tooltip placement="top" title={'统计基本信息'} key="statistics">
            <a
              onClick={() => {
                if (selectedRowsState?.length > 0) {
                  if (selectedRowsState.length == 1) {
                    handleStatistic(selectedRowsState[0].id);
                    setSelectedRows([]);
                  } else {
                    message.warn('目前只支持单个库的基本信息的统计');
                    setSelectedRows([]);
                  }
                } else {
                  message.warn('请选择要统计的库');
                }
              }}
            >
              <Tag color="blue">
                <Icon style={{ verticalAlign: '-4px', fontSize: '16px' }} icon="mdi:file-chart" />
                统计基本信息
              </Tag>
            </a>
          </Tooltip>,
          <Tooltip placement="top" title={'统计肽段重复率'} key="repeatCount">
            <a
              key="repeatCount"
              onClick={() => {
                if (selectedRowsState?.length > 0) {
                  if (selectedRowsState.length == 1) {
                    handleRepeatCount(selectedRowsState[0].id);
                    setSelectedRows([]);
                  } else {
                    message.warn('目前只支持单个库的肽段重复率的统计');
                    setSelectedRows([]);
                  }
                } else {
                  message.warn('请选择要统计的库');
                }
              }}
            >
              <Tag color="blue">
                <Icon style={{ verticalAlign: '-4px', fontSize: '16px' }} icon="mdi:file-percent" />
                统计肽段重复率
              </Tag>
            </a>
          </Tooltip>,
          <Tooltip placement="top" title={'删除'} key="delete">
            <a
              key="delete"
              onClick={async () => {
                formDelete?.resetFields();
                if (selectedRowsState?.length > 0) {
                  if (selectedRowsState.length == 1) {
                    handleDeleteModalVisible(true);
                  } else {
                    message.warn('目前只支持单个库的删除');
                    setSelectedRows([]);
                  }
                } else {
                  message.warn('请选择要删除的库');
                }
              }}
            >
              <Tag color="error">
                <Icon style={{ verticalAlign: '-4px', fontSize: '16px' }} icon="mdi:delete" />
                删除
              </Tag>
            </a>
          </Tooltip>,
        ]}
        request={libraryList}
        columns={columns}
        rowSelection={{
          selectedRowKeys: selectedRowsState?.map((item) => {
            return item.id;
          }),
          onChange: (_, selectedRowKeys) => {
            setSelectedRows(selectedRowKeys);
          },
        }}
      />

      {/* 新建列表 */}
      <CreateForm
        form={formCreate}
        onCancel={{
          onCancel: () => {
            handleModalVisible(false);
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
      <UpdateForm
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
      />

      {/* 删除列表 */}
      <DeleteForm
        selectedRowsState={selectedRowsState}
        form={formDelete}
        onCancel={{
          onCancel: () => {
            handleDeleteModalVisible(false);
            setSelectedRows([]);
            formDelete?.resetFields();
          },
        }}
        onSubmit={async (value) => {
          if (value.name === selectedRowsState[0]?.name) {
            const success = await handleRemove(selectedRowsState);
            if (success) {
              handleDeleteModalVisible(false);
              setSelectedRows([]);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          } else {
            message.error('你没有删除的决心，给👴🏻 爬');
          }
        }}
        deleteModalVisible={deleteModalVisible}
      />

      {/* 克隆列表 */}
      <CloneForm
        form={formClone}
        onCancel={{
          onCancel: () => {
            handleCloneModalVisible(false);
            setSelectedRows([]);
            formClone?.resetFields();
          },
        }}
        onSubmit={async (params) => {
          const p: { id: any; newLibName: string; includeDecoy?: boolean } = {
            id: '',
            newLibName: '',
            includeDecoy: false,
          };
          p.id = selectedRowsState[0].id;
          p.newLibName = params.newLibName;
          p.includeDecoy = params.includeDecoy;

          const success = await handleClone(p);
          if (success) {
            handleCloneModalVisible(false);
            setSelectedRows([]);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        cloneModalVisible={cloneModalVisible}
        values={selectedRowsState}
      />
    </>
  );
};

export default TableList;
