import React from 'react';
import ProForm, {
  ProFormText,
  ModalForm,
  ProFormSelect,
  ProFormTextArea,
  ProFormUploadDragger,
} from '@ant-design/pro-form';
import { Button, Input, Space, Tabs } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
// 上传组件参数
const uploadConfig = {
  progress: {
    strokeColor: {
      '0%': '#108ee9',
      '100%': '#87d068',
    },
    strokeWidth: 3,
    format: (percent: number) => `${parseFloat(percent.toFixed(2))}%`,
  },
};
export type addFormValueType = {
  id:string;
  key:string,
  value:string
};
export type AddFormProps = {
  onSubmit: (values: addFormValueType) => Promise<void>;
  onCancel: Record<string, () => void>;
  addModalVisible: boolean;
  values: any;
  form: any;
};




const AddFormItem: React.FC<AddFormProps> = (props) => {
  return (
    <ModalForm
      form={props.form}
      title="增加字典值"
      width={530}
      visible={props.addModalVisible}
      modalProps={props.onCancel}
      onFinish={props.onSubmit}
    >
      <ProFormText
      disabled
        label="id值"
        name="id"
        initialValue={props.values.id}
      />
      <ProFormText
        label="key"
        name="key"
      />
      <ProFormText
        label="value"
        name="value"
      />

    </ModalForm>
  );
};

export default AddFormItem;
