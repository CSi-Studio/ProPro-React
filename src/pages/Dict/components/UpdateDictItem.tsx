import React, { useState } from 'react';
import { ProFormTextArea, ModalForm, ProFormText } from '@ant-design/pro-form';
import { getDict } from '../service';
export type updateFormValueType = {
  key?: string;
  value?: string;
};
export type addFormValueType = {
  name: string;
};

export type UpdateFormProps = {
  onSubmit: (values: updateFormValueType) => Promise<void>;
  onCancel: () => void;
  updateModalVisible: boolean;
  values: any;
  form: any;
};

export type AddFormProps = {
  onSubmit: (values: addFormValueType) => Promise<void>;
  onCancel: () => void;
  updateModalVisible: boolean;
  values: any;
  form: any;
};

export type updateFormValue = {
  id?: string;
  key?: any;
  value?: any;
};
 


const UpdateForm: React.FC<UpdateFormProps> =   (props) => {



  return (
    <ModalForm
      form={props.form}
      title="更新字典值"
      width={530}
      visible={props.updateModalVisible}
      modalProps={{
        maskClosable: false,
        onCancel: () => {
          props.onCancel();
        },
      }}
      onFinish={props.onSubmit}
    >
      <ProFormText disabled label="字典名" name="id" initialValue={props.values?.name} />
      <ProFormText disabled label="key值" name="key" initialValue={props.values.key} />
      <ProFormTextArea label="value值" name="value" />
    </ModalForm>
  );
};

export default UpdateForm;
