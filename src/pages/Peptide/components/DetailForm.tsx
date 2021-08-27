import React from 'react';
import { Drawer, Table, Tag, Tooltip } from 'antd';
import type { TableListItem } from '../data';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';

export type UpdateFormProps = {
  showDetail: any;
  currentRow: any;
  columns: any;
  onClose: () => void;
};
const DetailForm: React.FC<UpdateFormProps> = (props) => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (dom: any) => {
        return <Tag>{dom}</Tag>;
      },
    },
    {
      title: '库ID',
      dataIndex: 'libraryId',
      render: (dom: any) => {
        return <Tag>{dom}</Tag>;
      },
    },
    {
      title: '蛋白质名称',
      dataIndex: 'proteins',
    },
    {
      title: 'PeptideRef',
      dataIndex: 'peptideRef',
    },
    {
      title: 'm/z',
      dataIndex: 'mz',
    },
    {
      title: 'RT',
      dataIndex: 'rt',
    },
    {
      title: '带电量',
      dataIndex: 'charge',
    },
    {
      title: '肽段完整名称',
      dataIndex: 'fullName',
    },
    {
      title: '肽段序列',
      dataIndex: 'sequence',
    },
    {
      title: '伪肽段',
      dataIndex: 'decoySequence',
    }
   ]
  columns.push(props.columns.pop());

  return (
    <Drawer width={900} visible={props.showDetail} onClose={props.onClose} closable={false}>
      {props.currentRow?.peptideRef && (
        <>
          <ProDescriptions<TableListItem>
            column={2}
            title={props.currentRow?.peptideRef}
            request={async () => ({
              data: props.currentRow,
            })}
            params={{
              id: props.currentRow?.peptideRef,
            }}
            columns={columns as ProDescriptionsItemProps<TableListItem>[]}
          />
          <Table
            title={() => '离子片段：'}
            bordered={false}
            pagination={false}
            size="small"
            dataSource={props.currentRow.fragments}
            columns={[
              {
                title: 'cutInfo',
                dataIndex: 'cutInfo',
              },
              {
                title: '碎片荷质比',
                dataIndex: 'mz',
              },
              {
                title: '强度',
                dataIndex: 'intensity',
              },
              {
                title: '带电量',
                dataIndex: 'charge',
              },
              {
                title: 'Annotations',
                dataIndex: 'annotations',
              },
            ]}
          />
          <Table
            title={() => '伪离子片段：'}
            bordered={false}
            pagination={false}
            size="small"
            dataSource={props.currentRow.decoyFragments}
            columns={[
              {
                title: 'cutInfo',
                dataIndex: 'cutInfo',
              },
              {
                title: '碎片荷质比',
                dataIndex: 'mz',
              },
              {
                title: '强度',
                dataIndex: 'intensity',
              },
              {
                title: '带电量',
                dataIndex: 'charge',
              },
              {
                title: 'Annotations',
                dataIndex: 'annotations',
              },
            ]}
          />
        </>
      )}
    </Drawer>
  );
};

export default DetailForm;
