import React from 'react';
import { Drawer, Table, Tag } from 'antd';
import type { TableListItem } from '../data';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import { FormattedMessage } from 'umi';

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
      title: 'LibId',
      dataIndex: 'libraryId',
      render: (dom: any) => {
        return <Tag>{dom}</Tag>;
      },
    },
    {
      title: <FormattedMessage id="component.proteinName" />,
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
      title: 'Charge',
      dataIndex: 'charge',
    },
    {
      title: <FormattedMessage id="component.peptideFullName" />,
      dataIndex: 'fullName',
    },
    {
      title: <FormattedMessage id="component.peptideSequence" />,
      dataIndex: 'sequence',
    },
    {
      title: <FormattedMessage id="component.decoySequence" />,
      dataIndex: 'decoySequence',
    },
  ];
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
            title={() => <FormattedMessage id="table.fragments" />}
            bordered={false}
            pagination={false}
            size="small"
            dataSource={props.currentRow.fragments}
            columns={[
              {
                title: 'CutInfo',
                dataIndex: 'cutInfo',
              },
              {
                title: 'm/z',
                dataIndex: 'mz',
              },
              {
                title: 'Intensity',
                dataIndex: 'intensity',
              },
              {
                title: 'Charge',
                dataIndex: 'charge',
              },
              {
                title: 'Annotations',
                dataIndex: 'annotations',
              },
            ]}
          />
          <Table
            title={() => <FormattedMessage id="component.pseudoIonFragment" />}
            bordered={false}
            pagination={false}
            size="small"
            dataSource={props.currentRow.decoyFragments}
            columns={[
              {
                title: 'CutInfo',
                dataIndex: 'cutInfo',
              },
              {
                title: 'm/z',
                dataIndex: 'mz',
              },
              {
                title: 'Intensity',
                dataIndex: 'intensity',
              },
              {
                title: 'Charge',
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
