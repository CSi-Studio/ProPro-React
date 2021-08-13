import React from 'react';
import ProForm, {
  ProFormTextArea,
  ModalForm,
  ProFormText,
} from '@ant-design/pro-form';

export type updateFormValueType = {
  key?:string;
  value?:string
};
export type addFormValueType = {
  name:string
};

export type UpdateFormProps = {
  onSubmit: (values: updateFormValueType) => Promise<void>;
  onCancel: Record<string, () => void>;
  updateModalVisible: boolean;
  values: any;
  form: any;
};

export type AddFormProps = {
  onSubmit: (values: addFormValueType) => Promise<void>;
  onCancel: Record<string, () => void>;
  updateModalVisible: boolean;
  values: any;
  form: any;
};

export type updateFormValue = {
    id?:string;
    key?: any;
    value?: any;
  };

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  return (
    <ModalForm
      form={props.form}
      title="更新字典值"
      width={530}
      visible={props.updateModalVisible}
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
      disabled
        label="key值"
        name="key"
        initialValue={props.values.key}
      />
      <ProFormTextArea
        label="value值"
        name="value"
      />
    </ModalForm>
  );
};

const AddForm: React.FC<AddFormProps> = (props) => {
  return (
    <ModalForm
      form={props.form}
      title="增加字典"
      width={530}
      visible={props.updateModalVisible}
      modalProps={props.onCancel}
      onFinish={props.onSubmit}
    >
      <ProFormText
      disabled
        label="字典名"
        name="name"
      />

    </ModalForm>
  );
};

export default UpdateForm;
