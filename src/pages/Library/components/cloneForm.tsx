import React from 'react';
import { ProFormText, ModalForm, ProFormSelect } from '@ant-design/pro-form';
import { Button } from 'antd';
import { TableListItem } from '../data';

export type cloneFormValueType = {
  id: any;
  newLibName: string;
  includeDecoy?: boolean;
};

export type CloneFormProps = {
  onSubmit: (values: cloneFormValueType) => Promise<void>;
  onCancel: Record<string, () => void>;
  cloneModalVisible: boolean;
  values?: TableListItem[];
  form: any;
};
const a: number = 1;
const CloneForm: React.FC<CloneFormProps> = (props) => {
  return (
    <ModalForm
      form={props.form}
      title="克隆一个库"
      width={400}
      visible={props.cloneModalVisible}
      modalProps={props.onCancel}
      onFinish={props.onSubmit}
      submitter={{
        searchConfig: {
          submitText: '提交',
        },
        resetButtonProps: {
          style: {
            display: 'none',
          },
        },
        submitButtonProps: {},
        render: (prop) => {
          return [
            <Button type="primary" key="submit" onClick={() => prop.form?.submit?.()}>
              确定
            </Button>,
          ];
        },
      }}
    >
      <ProFormText
        rules={[
          {
            required: true,
            message: '库名字不能为空',
          },
        ]}
        width="sm"
        name="newLibName"
        label="库名称"
        tooltip="库名称必须唯一"
        placeholder="请输入库名称"
      />
      <ProFormSelect
        initialValue="false"
        options={[
          {
            value: 'false',
            label: '否',
          },
          {
            value: 'true',
            label: '是',
          },
        ]}
        width="sm"
        name="includeDecoy"
        label="克隆是否包含伪肽段"
      />
    </ModalForm>
  );
};

export default CloneForm;
