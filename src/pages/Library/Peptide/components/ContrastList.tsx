import React, { useState } from 'react';
import { ModalForm } from '@ant-design/pro-form';
import { Table, Tooltip, Transfer } from 'antd';
import { Tag } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';

export type ContrastListFormProps = {
  contrastModalVisible: boolean;
  onSubmit: (values: any) => Promise<void>;
  onCancel: Record<string, () => void>;
  values: any;
  form: any;
  predictList: any;
};
export type TableListItem = {
  key: number;
  mz: string;
  cutInfo: string;
  intensity: string;
};
const ContrastList: React.FC<ContrastListFormProps> = (props) => {
  /** 全选 */
  const [selectedRowsState, setSelectedRows] = useState<{ mz: string; cutInfo: string }[]>();
  const columns: ProColumns[] = [
    {
      title: '真肽段碎片荷质比',
      dataIndex: 'mz',
      sorter: (a, b) => (a.mz > b.mz ? -1 : 1),
      render: (dom, entity) => {
        // return entity.predict ? null : <Tooltip title={dom}>{dom}</Tooltip>;
        return <Tooltip title={dom}>{dom}</Tooltip>;
      },
    },
    {
      title: 'cutInfo',
      dataIndex: 'cutInfo',
      sorter: (a, b) => (a.cutInfo > b.cutInfo ? -1 : 1),
      render: (dom, entity) => {
        return (
          <Tooltip title={dom}>
            <Tag>{dom}</Tag>
          </Tooltip>
        );
      },
    },
    {
      title: '预测肽段碎片荷质比',
      dataIndex: 'predictMz',
      sorter: (a, b) => (a.mz > b.mz ? -1 : 1),
      render: (dom, entity) => {
        // return entity.predict ? <Tooltip title={dom}>{dom}</Tooltip> : null;
        return <Tooltip title={dom}>{dom}</Tooltip>;
      },
    },
  ];

  props?.values?.fragments?.forEach((item?: any) => {
    props?.predictList?.data?.forEach((_item?: any, index?: number) => {
      if (item.cutInfo === _item.cutInfo) {
        // eslint-disable-next-line no-param-reassign
        item.predictMz = _item.mz;
        props?.predictList?.data.splice(index, 1);
      }
      // eslint-disable-next-line no-console
    });
  });
  const data = props?.values?.fragments
    ?.concat(props?.predictList?.data)
    ?.sort((a: any, b: any) => {
      return a.intensity - b.intensity;
    });
  if (data) {
    data?.forEach((item?: { key: any }, index?: any) => {
      if (item) {
        // eslint-disable-next-line no-param-reassign
        item.key = index;
      }
    });
  }
  return (
    <ModalForm
      form={props.form}
      title="🧩 肽段碎片比较"
      width={530}
      modalProps={props.onCancel}
      onFinish={props.onSubmit}
      visible={props.contrastModalVisible}
    >
      {props.values?.peptideRef && (
        <ProTable
          columns={columns}
          request={(params, sorter, filter) => {
            // 表单搜索项会从 params 传入，传递给后端接口。
            // eslint-disable-next-line no-console
            console.log(params, sorter, filter);
            return Promise.resolve({
              data,
              success: true,
            });
          }}
          pagination={false}
          toolBarRender={false}
          search={false}
          rowKey="key"
          rowSelection={{
            onChange: (_, selectedRows) => {
              // eslint-disable-next-line no-console
              console.log('_----', _);
              // eslint-disable-next-line no-console
              console.log('selectedRows---', selectedRows);

              setSelectedRows(selectedRows);
            },
          }}
        />
      )}
    </ModalForm>
  );
};

export default ContrastList;
