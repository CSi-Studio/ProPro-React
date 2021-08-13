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
  name:string
};
export type AddFormProps = {
  onSubmit: (values: addFormValueType) => Promise<void>;
  onCancel: Record<string, () => void>;
  createModalVisible: boolean;
  values: any;
  form: any;
};




const AddForm: React.FC<AddFormProps> = (props) => {
  return (
    <ModalForm
      form={props.form}
      title="增加字典"
      width={530}
      visible={props.createModalVisible}
      modalProps={props.onCancel}
      onFinish={props.onSubmit}
    >
      <ProFormText
        label="字典名"
        name="name"
      />

    </ModalForm>
  );
};

export default AddForm;
