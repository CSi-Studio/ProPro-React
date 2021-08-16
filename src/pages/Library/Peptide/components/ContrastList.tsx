import React, { useState } from 'react';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { Button, Form, Input, Table, Tooltip, Transfer } from 'antd';
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
      dataIndex: 'trueMz',
      render: (dom, entity) => {
        if (!entity.predict) {
          return (
            <Tag color="green">
              <Tooltip title={dom}>{dom}</Tooltip>
            </Tag>
          );
        }
        if (entity.trueMz && entity.trueMz !== entity.mz) {
          return (
            <Tag color="orange">
              <Tooltip title={dom}>{dom}</Tooltip>
            </Tag>
          );
        }
      },
    },
    {
      title: 'cutInfo',
      dataIndex: 'cutInfo',
      sorter: (a, b) => (a.predict > b.predict ? -1 : 1),
      render: (dom, entity) => {
        return <Tooltip title={dom}>{dom}</Tooltip>;
      },
    },
    {
      title: '预测肽段碎片荷质比',
      dataIndex: 'mz',
      render: (dom, entity) => {
        if (entity.predict) {
          if (entity.trueMz && entity.trueMz !== entity.mz) {
            return (
              <Tag color="orange">
                <Tooltip title={dom}>{dom}</Tooltip>
              </Tag>
            );
          }
          return (
            <Tag color="green">
              <Tooltip title={dom}>{dom}</Tooltip>
            </Tag>
          );
        }
        return null;
      },
    },
  ];
  // eslint-disable-next-line no-console
  console.log('真肽段-----', props?.values?.fragments);
  // eslint-disable-next-line no-console
  console.log('预测结果-----', props?.predictList?.data);
  props?.values?.fragments?.forEach((item: any, index: number) => {
    props?.predictList?.data?.forEach((_item: any) => {
      // eslint-disable-next-line no-param-reassign
      item.trueMz = item.mz;
      if (item.cutInfo === _item.cutInfo) {
        // eslint-disable-next-line no-console
        console.log(item.cutInfo);
        // eslint-disable-next-line no-console
        console.log(_item.cutInfo);
        // eslint-disable-next-line no-param-reassign
        _item.trueMz = item.mz;
        props?.values?.fragments.splice(index, 1);
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

  // eslint-disable-next-line no-console
  console.log('最终结果-----', data);

  const rowSelection = {
    getCheckboxProps: (record: any) => ({
      disabled: record.predict === null || record.trueMz,
    }),
  };

  return (
    <ModalForm
      form={props.form}
      title="🧩 肽段碎片比较"
      width={530}
      modalProps={props.onCancel}
      onFinish={props.onSubmit}
      visible={props.contrastModalVisible}
      submitter={{
        // 配置按钮文本
        searchConfig: {
          submitText: '提交',
        },
        // 配置按钮的属性

        submitButtonProps: {},

        // 完全自定义整个区域
        render: (_props) => {
          return [
            <Button
              type="primary"
              key="submit"
              onClick={() => {
                _props.form?.setFieldsValue({ fragments: selectedRowsState });
                _props.form?.submit?.();
              }}
            >
              提交
            </Button>,
          ];
        },
      }}
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
          tableAlertRender={false}
          rowSelection={{
            ...rowSelection,
            onChange: (_, selectedRows) => {
              setSelectedRows(selectedRows);
            },
          }}
        />
      )}
      <Form.Item style={{ display: 'none' }} name="fragments" key="fragments">
        <Input />
      </Form.Item>
    </ModalForm>
  );
};

export default ContrastList;
