import React, { useState } from 'react';
import { ModalForm } from '@ant-design/pro-form';
import { Button, Form, Input, Tooltip } from 'antd';
import { Tag } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';

export type ContrastListFormProps = {
  contrastModalVisible: boolean;
  onSubmit: (values: any) => Promise<void>;
  onCancel: () => void;
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
  const [selectedRows, setSelectedRows] = useState<{ mz: string; cutInfo: string }[]>();
  const columns: ProColumns[] = [
    {
      title: '库中肽段碎片荷质比',
      dataIndex: 'trueMz',
      render: (dom, entity) => {
        if (entity.trueMz && entity.trueMz !== entity.mz) {
          return (
            <Tag color="orange">
              <Tooltip title={dom}>{dom}</Tooltip>
            </Tag>
          );
        }
        if (entity.trueMz && entity.trueMz === entity.mz) {
          return (
            <Tag color="green">
              <Tooltip title={dom}>{dom}</Tooltip>
            </Tag>
          );
        }
        return false;
      },
    },
    {
      title: 'cutInfo',
      dataIndex: 'cutInfo',
      sorter: (a, b) => (a.predict > b.predict ? -1 : 1),
      render: (dom) => {
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
        return false;
      },
    },
  ];

  const rowSelection = {
    getCheckboxProps: (record: any) => ({
      disabled: record.predict === null || record.trueMz,
    }),
  };

  return (
    <ModalForm
      form={props.form}
      title="🧩 肽段碎片比较"
      width={600}
      modalProps={{
        maskClosable: false,
        onCancel: () => {
          props.onCancel();
        },
      }}
      onFinish={props.onSubmit}
      visible={props.contrastModalVisible}
      submitter={{
        searchConfig: {
          submitText: '提交',
        },
        render: (_props) => {
          return [
            <Button
              type="primary"
              key="submit"
              onClick={() => {
                _props.form?.setFieldsValue({ fragments: selectedRows });
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
          size="small"
          headerTitle={props.values?.peptideRef}
          request={() => {
            // ----------------------------------------
            let trueData: any[] = [];
            let predictData: any[] = [];
            let data: any[] = [];
            trueData = props?.values?.fragments;
            predictData = props?.predictList?.data;

            trueData?.forEach((item: any) => {
              // eslint-disable-next-line no-param-reassign
              item.trueMz = item.mz;
            });
            predictData?.forEach((_item: any) => {
              trueData?.forEach((item: any, index: number) => {
                if (_item.cutInfo === item.cutInfo) {
                  // eslint-disable-next-line no-param-reassign
                  _item.trueMz = item.mz;
                  trueData.splice(index, 1);
                }
              });
            });

            data = predictData?.concat(trueData)?.sort((a: any, b: any) => {
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
            // ----------------------------------------
            return Promise.resolve({
              data,
              success: true,
            });
          }}
          pagination={false}
          options={{ fullScreen: false, reload: false, setting: true, density: false }}
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
