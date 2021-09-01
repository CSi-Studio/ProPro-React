import React from 'react';
import ProForm, { ProFormText, ModalForm } from '@ant-design/pro-form';

export type updateFormValueType = {
  alias?: string;
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
  return (
    <ModalForm
      form={props.form}
      title="更新实验信息"
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
      <ProForm.Group>
        <ProFormText
          initialValue={props?.values?.alias}
          width="md"
          name="alias"
          label="别名"
          placeholder="别名"
        />
      </ProForm.Group>
    </ModalForm>
  );
};

export default UpdateForm;
