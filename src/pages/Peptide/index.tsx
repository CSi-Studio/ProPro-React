import { Form, message, Tooltip, Tag, Space, Row, Col } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { peptideList, predictPeptide, removeList, updateFragment, updateList } from './service';
import type { TableListItem, TableListPagination } from './data';
import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { Icon } from '@iconify/react';
import DeleteForm from './components/DeleteForm';
import type { updateFormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import DetailForm from './components/DetailForm';
import type { predictFormValueType } from './components/PredictForm';
import PredictForm from './components/PredictForm';
import ContrastList from './components/ContrastList';

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
 * 删除库
 * @param currentRow
 */
const handleRemove = async (currentRow: TableListItem | undefined) => {
  if (!currentRow) return true;
  try {
    await removeList({
      peptideId: currentRow.id,
    });
    message.success('删除成功，希望你不要后悔 🥳');
    return true;
  } catch (error) {
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList: React.FC = (props) => {
  /** 全局弹窗 */
  // const [popup, setPopup] = useState<boolean>(false);
  /** 全选 */
  // const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>();
  /** 删除窗口的弹窗 */
  const [formDelete] = Form.useForm();
  const [deleteModalVisible, handleDeleteModalVisible] = useState<boolean>(false);
  /** 更新窗口的弹窗 */
  const [formUpdate] = Form.useForm();
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  /** 预测肽段碎片的弹窗 */
  const [formPredict] = Form.useForm();
  const [predictModalVisible, handlePredictModalVisible] = useState<boolean>(false);
  /** 对比肽段碎片的弹窗 */
  const [formContrast] = Form.useForm();
  const [contrastModalVisible, handleContrastModalVisible] = useState<boolean>(false);
  const [total, setTotal] = useState<any>();
  /** 库详情的抽屉 */
  const [showDetail, setShowDetail] = useState<boolean>(false);
  /** 预测弹窗 */
  const [predictList, setPredictList] = useState<any>();

  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const actionRef = useRef<ActionType>();

  const { libraryId } = props?.location?.query;

  /**
   * 预测肽段碎片
   * @param values
   */
  const handlePredict = async (values: predictFormValueType) => {
    const hide = message.loading('正在预测肽段碎片');
    try {
      const predictData = await predictPeptide({ ...values });
      setPredictList(predictData);
      hide();
      message.success('预测肽段碎片完成');
      handleContrastModalVisible(true);
      return true;
    } catch (error) {
      hide();
      message.error('预测失败，请重试!');
      return false;
    }
  };
  /**
   * 预测对比
   * @param values
   */
  const handleContrast = async (value: { fragments: any[] }) => {
    const hide = message.loading('正在加载');
    value.fragments.map((item: any) => {
      // eslint-disable-next-line no-param-reassign
      item.predict = null;
      // eslint-disable-next-line no-param-reassign
      delete item.key;
      return true;
    });

    try {
      await updateFragment({ peptideId: currentRow?.id }, value.fragments);
      hide();
      message.success('添加成功');
      return true;
    } catch (error) {
      hide();
      message.error('添加失败，请重试!');
      return false;
    }
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'PeptideRef',
      dataIndex: 'peptideRef',
      render: (dom, entity) => {
        return (
          <Space direction="vertical">
            <Tag color="green">真:{entity.peptideRef}</Tag>
            <Tag color="red">伪:{entity.decoySequence}</Tag>
          </Space>
        );
      },
    },
    {
      title: 'm/z',
      dataIndex: 'mz',
      hideInSearch: true,
    },
    {
      title: 'RT',
      dataIndex: 'rt',
      hideInSearch: true,
    },
    {
      title: '离子片段',
      dataIndex: 'fragments',
      hideInSearch: true,
      children: [
        {
          title: 'CutInfo',
          dataIndex: 'cutInfo',
          hideInSearch: true,
          width: 100,
          render: (dom, entity) => [
            <Row gutter={[8, 8]}>
              {entity.fragments.map((item) => (
                <Col span={16}>{item.cutInfo}</Col>
              ))}
            </Row>,
          ],
        },
        {
          title: '碎片荷质比',
          dataIndex: 'mz',
          hideInSearch: true,
          width: 200,
          render: (dom, entity) => [
            <Row gutter={[8, 8]}>
              {entity.fragments.map((item) => (
                <Col span={16}>
                  <Tooltip title={item.mz}>{item.mz}</Tooltip>
                </Col>
              ))}
            </Row>,
          ],
        },
        {
          title: '强度',
          dataIndex: 'intensity',
          hideInSearch: true,
          width: 120,
          render: (dom, entity) => [
            <Row gutter={[8, 8]}>
              {entity.fragments.map((item) => (
                <Col span={16}>{item.intensity}</Col>
              ))}
            </Row>,
          ],
        },
        {
          title: '带电量',
          dataIndex: 'charge',
          hideInSearch: true,
          width: 60,
          render: (dom, entity) => [
            <Row gutter={[8, 8]}>
              {entity.fragments.map((item) => (
                <Col span={16}>{item.charge}</Col>
              ))}
            </Row>,
          ],
        },
        {
          title: 'Annotations',
          dataIndex: 'Annotations',
          hideInSearch: true,
          width: 150,
          render: (dom, entity) => [
            <Row gutter={[8, 8]}>
              {entity.fragments.map((item) => (
                <Col
                  style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                  span={24}
                >
                  <Tooltip title={item.annotations}>{item.annotations}</Tooltip>
                </Col>
              ))}
            </Row>,
          ],
        },
      ],
    },
    {
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      hideInSearch: true,
      width: '120px',
      render: (text, record) => [
        <Tooltip title={'编辑'} key="edit">
          <a
            onClick={() => {
              formUpdate?.resetFields();
              handleUpdateModalVisible(true);
              setCurrentRow(record);
            }}
            key="detail"
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
            key="detail"
          >
            <Icon style={{ verticalAlign: 'middle', fontSize: '20px' }} icon="mdi:file-document" />
          </a>
        </Tooltip>,
        <Tooltip title={'预测肽段碎片'} key="predict">
          <a
            onClick={() => {
              formPredict?.resetFields();
              handlePredictModalVisible(true);
              setCurrentRow(record);
            }}
            key="predict"
          >
            <Icon style={{ verticalAlign: 'middle', fontSize: '20px' }} icon="mdi:robot-dead" />
          </a>
        </Tooltip>,
        <Tooltip title={'删除'} key="delete">
          <a
            onClick={() => {
              formDelete?.resetFields();
              handleDeleteModalVisible(true);
              setCurrentRow(record);
            }}
            key="delete"
          >
            <Icon style={{ verticalAlign: 'middle', fontSize: '18px' }} icon="mdi:delete" />
          </a>
        </Tooltip>,
      ],
    },
  ];
  return (
    <>
      <ProTable<TableListItem, TableListPagination>
        scroll={{ x: 'max-content' }}
        bordered
        headerTitle={
          props?.location?.state?.libraryName === undefined
            ? '肽段列表'
            : '标准库名称：' + props?.location?.state?.libraryName
        }
        actionRef={actionRef}
        search={{ labelWidth: 'auto' }}
        rowKey="id"
        size="small"
        pagination={{
          total: total,
        }}
        request={async (params) => {
          const msg = await peptideList({ libraryId, ...params });
          setTotal(msg.totalNum);
          return Promise.resolve(msg);
        }}
        tableAlertRender={false}
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

      {/* 预测肽段碎片弹窗 */}
      <PredictForm
        form={formPredict}
        onCancel={{
          onCancel: () => {
            setCurrentRow(undefined);
            handlePredictModalVisible(false);
            formPredict?.resetFields();
          },
        }}
        onSubmit={async (value) => {
          // eslint-disable-next-line no-param-reassign
          value.peptideId = currentRow?.id as string;
          const success = await handlePredict(value);
          if (success) {
            handlePredictModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        predictModalVisible={predictModalVisible}
        values={currentRow || {}}
      />
      {/* 预测对比弹窗 */}
      <ContrastList
        form={formContrast}
        onCancel={{
          onCancel: () => {
            handleContrastModalVisible(false);
            setCurrentRow(undefined);
            formContrast?.resetFields();
          },
        }}
        onSubmit={async (value) => {
          const success = await handleContrast(value);
          if (success) {
            handleContrastModalVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        contrastModalVisible={contrastModalVisible}
        values={currentRow}
        predictList={predictList}
      />

      {/* 删除列表 */}
      <DeleteForm
        currentRow={currentRow}
        form={formDelete}
        onCancel={{
          onCancel: () => {
            handleDeleteModalVisible(false);
            setCurrentRow(undefined);
            formDelete?.resetFields();
          },
        }}
        onSubmit={async (value) => {
          if (value.name === currentRow?.peptideRef) {
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
    </>
  );
};

export default TableList;
