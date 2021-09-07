import { Form, message, Tag, Tooltip, Space } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { dataList } from './service';
import type { TableListItem, TableListPagination } from './data';
import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import {
  FieldNumberOutlined,
} from '@ant-design/icons';

const TableList: React.FC = (props: any) => {
  /** 全选 */
  const [selectedRows, setSelectedRows] = useState<TableListItem[]>([]);
  const [total, setTotal] = useState<any>();
  const [currentRow, handleCurrentRow] = useState<any>();
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'Proteins',
      dataIndex: 'proteins',
      render: (dom, entity) => {
        let pros: any[] = [];
        if (entity.proteins) {
          entity.proteins.forEach((pro) => {
            pros.push(<Tag key={pro}>{pro}</Tag>);
          });
        }
        return <Space direction="vertical">{pros}</Space>;
      },
    },
    {
      title: 'Decoy',
      dataIndex: 'decoy',
      render: (dom, entity) => {
        if(entity.decoy){
          return <Tag color='red'>伪</Tag>;
        }else{
          return <Tag color='green'>真</Tag>;
        }
      },
    },
    {
      title: 'PeptideRef',
      dataIndex: 'peptideRef',
      render: (dom, entity) => {
        return (
          <Space direction="vertical">
            <Tag color="green">{entity.peptideRef}</Tag>
          </Space>
        );
      },
    },
    {
      title: 'FDR',
      dataIndex: 'fdr',
      render: (dom, entity)=>{
        return entity.fdr?<Tag color="green">{entity.fdr.toFixed(4)}</Tag>:<Tag color="red">NaN</Tag>
      }
    },
    {
      title: '鉴定状态',
      dataIndex: 'status',
      render: (dom, entity) => {
        switch(entity.status){
          case 0: return <Tag color="blue">等待鉴定</Tag>
          case 1: return <Tag color="green">鉴定成功</Tag>
          case 2: return <Tag color="red">鉴定失败</Tag>
          case 3: return <Tag color="purple">条件不符</Tag>
          case 4: return <Tag color="purple">峰组未知</Tag>
        }
        return <Tag color="yellow">未知状态</Tag>
      },
    },
    {
      title: 'RealRt/LibRt/ΔT',
      dataIndex: 'realRt',
      hideInSearch: true,
      render: (dom, entity)=>{
        let tags = [];

        if(entity.realRt){
          tags.push(<Tag key="1" color="green">{entity.realRt.toFixed(0)}</Tag>)
        }else{
          tags.push(<Tag key="1" color="red">NaN</Tag>)
        }
        
        if(entity.irt){
          tags.push(<Tag key="2" color="green">{entity.irt.toFixed(0)}</Tag>)
        }else{
          tags.push(<Tag key="2" color="red">NaN</Tag>)
        }
        if(entity.realRt && entity.irt){
          tags.push(<Tag key="3" color="blue">{Math.abs(entity.realRt - entity.irt).toFixed(1)}</Tag>)
        }
        return <>{tags}</>;
      }
    },
    {
      title: 'Sum',
      dataIndex: 'sum',
      hideInSearch: true,
      render: (dom, entity) =>{
        return <Tag color="purple">{entity.sum}</Tag>
      }
    },
    // {
    //   key: 'option',
    //   title: '更多',
    //   valueType: 'option',
    //   fixed: 'right',
    //   hideInSearch: true,
    //   width: '300px',
    //   render: (text, record) => (
    //     <>
    //       <a
    //         onClick={() => {
    //           handleCurrentRow(record);
    //         }}
    //       >
    //         <Tag icon={<FieldNumberOutlined />} color="blue">
    //           序列号
    //         </Tag>
    //       </a>
    //     </>
    //   ),
    // },
  ];

  /* 点击行选中相关 */
  const selectRow = (record: any) => {
    const rowData = [...selectedRows];
    if (rowData.length == 0) {
      rowData.push(record);
      setSelectedRows(rowData);
    } else {
      if (rowData.indexOf(record) >= 0) {
        rowData.splice(rowData.indexOf(record), 1);
      } else {
        rowData.push(record);
      }
      setSelectedRows(rowData);
    }
  };
  return (
    <>
      <ProTable<TableListItem, TableListPagination>
        bordered={true}
        scroll={{ x: 'max-content' }}
        size="small"
        headerTitle={
          props?.location?.state?.overviewName === undefined
            ? '分析结果列表'
            : props?.location?.state?.overviewName
        }
        actionRef={actionRef}
        rowKey="id"
        tableAlertRender={false}
        request={async (params) => {
          const msg = await dataList({ overviewId: props?.location?.query?.overviewId, ...params });
          setTotal(msg.totalNum);
          return Promise.resolve(msg);
        }}
        columns={columns}
        pagination={{
          total: total,
        }}
        toolBarRender={() => []}
        onRow={(record, index) => {
          return {
            onClick: () => {
              selectRow(record);
            },
          };
        }}
        rowSelection={{
          selectedRowKeys: selectedRows?.map((item) => {
            return item.id;
          }),
          onChange: (_, selectedRowKeys) => {
            setSelectedRows(selectedRowKeys);
          },
        }}
      />
     
     
    </>
  );
};

export default TableList;
