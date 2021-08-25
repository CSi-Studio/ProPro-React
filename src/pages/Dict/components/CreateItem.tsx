import React from 'react';
import { ProFormText, ModalForm } from '@ant-design/pro-form';

export type addFormValueType = {
  id: string;
  key: string;
  value: string;
};
export type AddFormProps = {
  onSubmit: (values: addFormValueType) => Promise<void>;
  onCancel: () => void;
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
      modalProps={{
        maskClosable: false,
        onCancel: () => {
          props.onCancel();
        },
      }}
      onFinish={props.onSubmit}
    >
      <ProFormText disabled label="id值" name="id" initialValue={props.values.id} />
      <ProFormText label="key" name="key" />
      <ProFormText label="value" name="value" />
    </ModalForm>
  );
};

export default AddFormItem;
