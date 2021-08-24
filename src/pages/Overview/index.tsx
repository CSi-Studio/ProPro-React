import { Icon } from '@iconify/react';
import { Tag, Tooltip } from 'antd';
import React, { useState, useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
<<<<<<< HEAD
import {
   overviewList, updateList
} from './service';
=======
import { overviewList } from './service';
>>>>>>> 27bfc4a290d2fea93484845cf16cb3008b8efc54
import type { TableListItem, TableListPagination } from './data';
import DetailForm from './components/overviewdetail';
import UpdateForm, { updateFormValueType } from './components/UpdateForm';

<<<<<<< HEAD


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

const TableList: React.FC = (props:any) => {
  const [formUpdate] = Form.useForm();
=======
const TableList: React.FC = (props: any) => {
>>>>>>> 27bfc4a290d2fea93484845cf16cb3008b8efc54
  /** 库详情的抽屉 */
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [total, setTotal] = useState<any>();
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const [updateRow, setUpdateRow] = useState<TableListItem>();
   /** 更新窗口的弹窗 */
   const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const projectId = props?.location?.query.projectId;
  const columns: ProColumns<TableListItem>[] = [
    {
      key: 'name',
      title: 'overView名',
      dataIndex: 'name',
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
      key: 'type',
      title: '类型',
      dataIndex: 'type',
    },

    {
      key: 'createDate',
      title: '生成时间',
      dataIndex: 'createDate',
    },
    {
      key: 'note',
      title: '标注',
      dataIndex: 'note',
      hideInSearch: true,
    },
    {
<<<<<<< HEAD
      key: 'option',
      title: '操作',
      valueType: 'option',
      copyable: true,
      width: 100,
      ellipsis: true,
      fixed: 'right',
      hideInSearch: true,
      render: (text, record) => (
        <Space>
          <Tooltip title={'编辑'}>
            <a
              onClick={() => {
                formUpdate?.resetFields();
                handleUpdateModalVisible(true);
                setUpdateRow(record);
              }}
            >
              <Icon style={{ verticalAlign: 'middle', fontSize: '20px' }} icon="mdi:file-edit" />
            </a>
          </Tooltip>
        </Space>
      ),
=======
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      width: '100',
      hideInSearch: true,
      render: (text, record) => [
        <Tooltip title={'编辑'} key="edit">
          <a
            onClick={() => {
              setCurrentRow(record);
              setShowDetail(true);
            }}
            key="detail"
          >
            <Tag color="blue">
              <Icon style={{ verticalAlign: '-4px', fontSize: '16px' }} icon="mdi:file-document" />
              详情
            </Tag>
          </a>
        </Tooltip>,
      ],
>>>>>>> 27bfc4a290d2fea93484845cf16cb3008b8efc54
    },
  ];
  return (
    <>
      <ProTable<TableListItem, TableListPagination>
        scroll={{ x: 'max-content' }}
        headerTitle="概要列表"
        actionRef={actionRef}
        rowKey="id"
        size="small"
<<<<<<< HEAD
        search={false}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
            
            }}
          >
            <Icon style={{ verticalAlign: 'middle', fontSize: '20px' }} icon="mdi:playlist-plus" />{' '}
            创建项目
          </Button>,
        ]}
=======
        // toolBarRender={() => [
        //   <Button type="primary" key="primary" onClick={() => {}}>
        //     <Icon style={{ verticalAlign: 'middle', fontSize: '20px' }} icon="mdi:playlist-plus" />{' '}
        //     创建项目
        //   </Button>,
        // ]}
>>>>>>> 27bfc4a290d2fea93484845cf16cb3008b8efc54
        tableAlertRender={false}
        pagination={{
          total: total,
        }}
        request={async (params) => {
          const msg = await overviewList({ projectId: projectId, ...params });
          setTotal(msg.totalNum);
          return Promise.resolve(msg);
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
<<<<<<< HEAD
    {/* 编辑列表 */}
    <UpdateForm
        form={formUpdate}
        onCancel={{
          onCancel: () => {
            handleUpdateModalVisible(false);
            setUpdateRow(undefined);
            formUpdate?.resetFields();
          },
        }}
        onSubmit={async (value) => {
          // eslint-disable-next-line no-param-reassign
          value.id = updateRow?.id as unknown as string;
          var mapvalue={id:value.id,tags:value.tags,note:value.note}
          console.log('mapvalue',mapvalue)
          const success = await handleUpdate(mapvalue);
          console.log("value",value)
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
    


   
   
    
=======
>>>>>>> 27bfc4a290d2fea93484845cf16cb3008b8efc54
    </>
  );
};

export default TableList;
