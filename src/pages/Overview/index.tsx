import { Icon } from '@iconify/react';
import { Form, message, Tag, Tooltip, Typography } from 'antd';
import React, { useState, useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { overviewList, overviewList2, updateList } from './service';
import type { TableListItem, TableListPagination } from './data';

import UpdateForm from './components/UpdateForm';
import { Link } from 'umi';
import DetailForm from './components/overviewdetail';

/**
 * 更新库
 * @param values
 */
const handleUpdate = async (values: any) => {
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
const { Text } = Typography;
const TableList: React.FC = (props: any) => {
  const [formUpdate] = Form.useForm();
  /** 库详情的抽屉 */
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [showLink, setShowLink] = useState<boolean>(false);
  const [total, setTotal] = useState<any>();
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const [updateRow, setUpdateRow] = useState<TableListItem>();
  /** 更新窗口的弹窗 */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const projectId = props?.location?.query?.projectId;
  const pjId = props?.location?.state?.projectId;
  const expId = props?.location?.state?.expId;

  const columns: ProColumns<TableListItem>[] = [
    {
      key: 'name',
      title: '概览名',
      dataIndex: 'name',
      render: (dom, entity) => {
        return (
          <Tooltip title={'Id:' + entity.id} placement="topLeft">
            <a
              onClick={() => {
                setCurrentRow(entity);
                setShowDetail(true);
              }}
            >
              {dom}
            </a>
          </Tooltip>
        );
      },
    },
    {
      key: 'defaultOne',
      title: '默认值',
      dataIndex: 'defaultOne',
      render:(text, entity)=>{
        return text?<Tag color='green'>Yes</Tag>:<Tag color='red'>No</Tag>
      }
    },
    {
      key: 'peakCount',
      title: '峰统计',
      dataIndex: 'statstic',
      render: (text, entity) => {
        return entity?.statistic?.TOTAL_PEAK_COUNT
      },
    },
    {
      key: 'peptideCount',
      title: '肽段统计',
      dataIndex: 'statstic',
      render: (text, entity) => {
        return entity?.statistic?.TOTAL_PEPTIDE_COUNT
      },
    },
    {
      key: 'tags',
      title: '标签',
      dataIndex: 'tags',
      hideInSearch: true,
      render: (text, entity) => {
        if (entity.tags && entity.tags.length !== 0) {
          let tagsDom: any[] = [];
          entity.tags.forEach((tag) => {
            tagsDom.push([<Tag key={tag}>{tag}</Tag>]);
          });
          return <>{tagsDom}</>;
        }
        return false;
      },
    },
    {
      key: 'note',
      title: '标注',
      dataIndex: 'note',
      hideInSearch: true,
      render: (dom, entity) => {
        if (entity.note) {
          return <>{entity?.statistic?.TOTAL_PEPTIDE_COUNT}</>;
        }
        return false;
      },
    },
    {
      key: 'option',
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      hideInSearch: true,
      render: (text, record) => (
        <>
          <Tooltip title={'编辑'}>
            <a
              onClick={() => {
                formUpdate?.resetFields();
                handleUpdateModalVisible(true);
                setUpdateRow(record);
              }}
            >
              <Tag color="blue">
                <Icon style={{ verticalAlign: 'middle', fontSize: '20px' }} icon="mdi:file-edit" />
                编辑
              </Tag>
            </a>
          </Tooltip>
          <Tooltip title={'编辑'}>
            <a
              onClick={() => {
                setCurrentRow(record);
                setShowDetail(true);
              }}
            >
              <Tag color="blue">
                <Icon
                  style={{ verticalAlign: 'middle', fontSize: '20px' }}
                  icon="mdi:file-document"
                />
                详情
              </Tag>
            </a>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <>
      <ProTable<TableListItem, TableListPagination>
        scroll={{ x: 'max-content' }}
        headerTitle={
          props?.location?.state?.projectName === undefined ? (
            <>
              <Text>概要列表</Text>
            </>
          ) : (
            <>
              <Link
                to={{
                  pathname: '/project/list',
                }}
              >
                <Text type="secondary">项目列表</Text>
              </Link>
              &nbsp;&nbsp;/&nbsp;&nbsp;
              <a>
                <Text>概要列表 所属项目：{props?.location?.state?.projectName}</Text>
              </a>
            </>
          )
        }
        actionRef={actionRef}
        rowKey="id"
        size="small"
        search={false}
        toolBarRender={() => []}
        tableAlertRender={false}
        pagination={{
          total: total,
        }}
        request={async (params) => {
          if (projectId) {
            const msg = await overviewList({ projectId: projectId, ...params });
            setTotal(msg.totalNum);
            return Promise.resolve(msg);
          } else {
            const msg = await overviewList2({ projectId: pjId, expId: expId, ...params });
            setTotal(msg.totalNum);
            return Promise.resolve(msg);
          }
        }}
        columns={columns}
        rowSelection={{}}
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
        onCancel={() => {
          handleUpdateModalVisible(false);
          setUpdateRow(undefined);
          formUpdate?.resetFields();
        }}
        onSubmit={async (value) => {
          // eslint-disable-next-line no-param-reassign
          value.id = updateRow?.id as unknown as string;
          var mapvalue = { id: value.id, tags: value.tags, note: value.note, defaultOne: value.defaultOne};
          const success = await handleUpdate(mapvalue);
          if (success) {
            handleUpdateModalVisible(false);
            setUpdateRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        updateModalVisible={updateModalVisible}
        values={updateRow || {}}
      />
    </>
  );
};

export default TableList;
