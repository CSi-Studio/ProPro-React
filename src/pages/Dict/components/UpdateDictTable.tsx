import React, { useState } from 'react';
import { ProFormTextArea, ModalForm, ProFormText } from '@ant-design/pro-form';
import { getDict } from '../service';
export type updateFormValueType = {
 desc:string
};


export type UpdateFormProps = {
  onSubmit: (values: updateFormValueType) => Promise<void>;
  onCancel: () => void;
  updateModalVisible: boolean;
  values: any;
  form: any;
};

export type updateFormValue = {
  id?: string;
  desc?: string
};
 

const UpdateTableForm: React.FC<UpdateFormProps> =   (props) => {



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
      <ProFormText disabled label="id值" name="id" initialValue={props.values?.id} />
      {/* <ProFormText disabled label="key值" name="key" initialValue={props.values.key} />
      <ProFormTextArea label="value值" name="value" /> */}
      <ProFormTextArea label="desc" name="desc" initialValue={props.values?.desc} /> 
    </ModalForm>
  );
};

export default UpdateTableForm;
