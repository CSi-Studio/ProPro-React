import React from 'react';
import { ProFormText, ModalForm } from '@ant-design/pro-form';
import { useIntl, FormattedMessage } from 'umi';

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
  const intl = useIntl();

  return (
    <ModalForm
      form={props.form}
      title={intl.formatMessage({
        id: 'table.addDict',
        defaultMessage: '新增字典',
      })}
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
      <ProFormText
        label={intl.formatMessage({
          id: 'table.difName',
          defaultMessage: '字典名',
        })}
        name="name"
      />
    </ModalForm>
  );
};

export default AddForm;
