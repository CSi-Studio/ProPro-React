/* eslint-disable no-console */
import React from 'react';
import { ModalForm } from '@ant-design/pro-form';

export type FormValueType = {
  id: string;
};

export type DeleteFormProps = {
  onSubmit: (value: FormValueType) => Promise<void>;
  onCancel: () => void;
  deleteDictModalVisible: boolean;
  values: any;
  form: any;
};

const DeleteDictForm: React.FC<DeleteFormProps> = (props) => {
  return (
    <ModalForm
      form={props.form}
      title="你确定要删除吗？"
      width={530}
      visible={props.deleteDictModalVisible}
      modalProps={{
        maskClosable: false,
        onCancel: () => {
          props.onCancel();
        },
      }}
      onFinish={props.onSubmit}
    ></ModalForm>
  );
};

export default DeleteDictForm;
