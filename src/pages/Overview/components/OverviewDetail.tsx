import React from 'react';
import { Drawer, Tag } from 'antd';
import type { TableListItem } from '@/pages/Overview/data';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { ProColumns } from '@ant-design/pro-table';
import ReactJson from 'react-json-view';

export type UpdateFormProps = {
  showDetail: any;
  currentRow: any;
  columns: any;
  onClose: () => void;
};

const DetailForm: React.FC<UpdateFormProps> = (props) => {
  const columns: ProColumns<TableListItem>[] = [
    {
      key: 'name',
      title: '概览名',
      dataIndex: 'name',
    },

    {
      key: 'expName',
      title: '实验名',
      dataIndex: 'expName',
    },
    {
      title: 'OverViewId',
      dataIndex: 'id',
      hideInTable: true,
      render: (dom) => {
        return <Tag>{dom}</Tag>;
      },
    },
    {
      title: 'ProjectId',
      dataIndex: 'projectId',
      hideInTable: true,
      render: (dom) => {
        return <Tag>{dom}</Tag>;
      },
    },
    {
      title: 'ExpId',
      dataIndex: 'expId',
      hideInTable: true,
      render: (dom) => {
        return <Tag>{dom}</Tag>;
      },
    },
    {
      key: 'params',
      title: '分析概览',
      dataIndex: 'params',
      render: (dom: any, entity: any) => {
        if (entity) {
          return (
            <>
              <ReactJson src={entity} />
            </>
          );
        }
        return false;
      },
    },
  ];
  return (
    <Drawer width={800} visible={props.showDetail} onClose={props.onClose} closable={false}>
      {props.currentRow?.name && (
        <ProDescriptions<TableListItem>
          column={1}
          title={props.currentRow?.name}
          request={async () => ({
            data: props.currentRow || {},
          })}
          params={{
            id: props.currentRow?.name,
          }}
          columns={columns as ProDescriptionsItemProps<TableListItem>[]}
        />
      )}
    </Drawer>
  );
};

export default DetailForm;
