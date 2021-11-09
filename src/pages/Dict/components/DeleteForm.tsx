/* eslint-disable no-console */
import React from 'react';
import { ModalForm } from '@ant-design/pro-form';
import { useIntl } from 'umi';

export type FormValueType = {
  id: string;
  key?: string;
};

export type DeleteFormProps = {
  onSubmit: (value: FormValueType) => Promise<void>;
  onCancel: () => void;
  deleteModalVisible: boolean;
  values: any;
  form: any;
};

const DeleteFormItem: React.FC<DeleteFormProps> = (props) => {
    const intl = useIntl();

  return (
    <ModalForm
      form={props.form}
      title={intl.formatMessage({
        id: 'component.confirmDeletion',
        defaultMessage: '你确定要删除吗？',
      })}
      width={530}
      visible={props.deleteModalVisible}
      modalProps={{
        maskClosable: false,
        onCancel: () => {
          props.onCancel();
        },
      }}
      onFinish={props.onSubmit}
    />
  );
};

export default DeleteFormItem;
