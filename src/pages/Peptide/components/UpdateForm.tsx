import React from 'react';
import ProForm, {
  ProFormSwitch,
  ProFormText,
  ModalForm,
} from '@ant-design/pro-form';
import { useIntl } from 'umi';

export type updateFormValueType = {
  isUnique?: boolean;
  mz?: number;
  protein?: string;
  rt?: number;
  id: string;
};

export type UpdateFormProps = {
  onSubmit: (values: updateFormValueType) => Promise<void>;
  onCancel: () => void;
  updateModalVisible: boolean;
  values: any;
  form: any;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const intl = useIntl();

  return (
    <ModalForm
      form={props.form}
      title={intl.formatMessage({
        id: 'table.editPeptideLib',
        defaultMessage: '编辑肽段库',
      })}
      width={750}
      visible={props.updateModalVisible}
      modalProps={{
        maskClosable: false,
        onCancel: () => {
          props.onCancel();
        },
      }}
      onFinish={props.onSubmit}
    >
      <ProForm.Group>
        <ProFormText initialValue={props.values.mz} width="sm" name="mz" label="m/z" />
        <ProFormText initialValue={props.values.rt} width="sm" name="rt" label="RT" />
        <ProFormSwitch
          initialValue={props.values.disable}
          width="sm"
          name="disable"
          label={intl.formatMessage({
            id: 'table.invalid',
            defaultMessage: '失效',
          })}
        />
      </ProForm.Group>
    </ModalForm>
  );
};

export default UpdateForm;
