import { Icon } from '@iconify/react';
import { Tag, Tooltip } from 'antd';
import React, { useState, useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { overviewList } from './service';
import type { TableListItem, TableListPagination } from './data';
import DetailForm from './components/overviewdetail';

const TableList: React.FC = (props: any) => {
  /** 库详情的抽屉 */
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [total, setTotal] = useState<any>();
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableListItem>();
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
        // toolBarRender={() => [
        //   <Button type="primary" key="primary" onClick={() => {}}>
        //     <Icon style={{ verticalAlign: 'middle', fontSize: '20px' }} icon="mdi:playlist-plus" />{' '}
        //     创建项目
        //   </Button>,
        // ]}
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
    </>
  );
};

export default TableList;
