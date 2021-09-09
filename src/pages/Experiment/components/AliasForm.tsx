import React from 'react';
import ProForm, { ProFormText, ModalForm } from '@ant-design/pro-form';

export type AliasFormProps = {
  onSubmit: (values: any) => Promise<void>;
  onCancel: () => void;
  aliasModalVisible: boolean;
  form: any;
};

const AliasForm: React.FC<AliasFormProps> = (props) => {
  return (
    <ModalForm
      form={props.form}
      title="设置别名"
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
          initialValue="exp"
          width="md"
          name="prefix"
          label="别名前缀"
          placeholder="别名前缀"
        />
      </ProForm.Group>
    </ModalForm>
  );
};

export default AliasForm;
