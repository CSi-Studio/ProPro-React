import React from 'react';
import { ProFormText, ModalForm } from '@ant-design/pro-form';

export type addFormValueType = {
  name: string;
};
export type AddFormProps = {
  onSubmit: (values: addFormValueType) => Promise<void>;
  onCancel: () => void;
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
      modalProps={{
        maskClosable: false,
        onCancel: () => {
          props.onCancel();
        },
      }}
      onFinish={props.onSubmit}
    >
      <ProFormText label="字典名" name="name" />
    </ModalForm>
  );
};

export default AddForm;
