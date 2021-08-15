/* eslint-disable no-console */
import React from 'react';
import { ProFormText, ModalForm } from '@ant-design/pro-form';
import { Space } from 'antd';
import { Tag } from 'antd';

export type FormValueType = {
  id:string,
  key?: string;
};

export type DeleteFormProps = {
  onSubmit: (value: FormValueType) => Promise<void>;
  onCancel: Record<string, () => void>;
  deleteModalVisible: boolean;
  values: FormValueType;
  form: any;
  currentRow: any;
};

const DeleteFormItem: React.FC<DeleteFormProps> = (props) => {
  return (
    <ModalForm
      form={props.form}
      title="你确定要删除吗？"
      width={530}
      visible={props.deleteModalVisible}
      modalProps={props.onCancel}
      onFinish={props.onSubmit}
    >
    </ModalForm>
  );
};

export default DeleteFormItem;