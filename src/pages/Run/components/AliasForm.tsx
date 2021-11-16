import React from 'react';
import ProForm, { ProFormText, ModalForm } from '@ant-design/pro-form';
import { useIntl } from 'umi';

export type AliasFormProps = {
  onSubmit: (values: any) => Promise<void>;
  onCancel: () => void;
  aliasModalVisible: boolean;
  form: any;
};

const AliasForm: React.FC<AliasFormProps> = (props) => {
  const intl = useIntl();

  return (
    <ModalForm
      form={props.form}
      title={intl.formatMessage({
        id: 'component.setAlias',
        defaultMessage: '设置别名',
      })}
      width={330}
      visible={props.aliasModalVisible}
      modalProps={{
        maskClosable: false,
        onCancel: () => {
          props.onCancel();
        },
      }}
      onFinish={props.onSubmit}
    >
      <ProForm.Group>
        <ProFormText
          initialValue="run"
          width="md"
          name="prefix"
          label={intl.formatMessage({
            id: 'component.aliasPrefix',
            defaultMessage: '别名前缀',
          })}
          placeholder={intl.formatMessage({
            id: 'component.aliasPrefix',
            defaultMessage: '别名前缀',
          })}
        />
      </ProForm.Group>
    </ModalForm>
  );
};

export default AliasForm;
