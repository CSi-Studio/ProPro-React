import React from 'react';
import ProForm, { ProFormText, ModalForm, ProFormSelect } from '@ant-design/pro-form';

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
          width="sm"
          name="alias"
          label="别名"
          placeholder="别名"
        />
        <ProFormText
          initialValue={props?.values?.label}
          width="sm"
          name="label"
          label="Label"
          placeholder="Label"
        />
      </ProForm.Group>
      <ProFormSelect
        initialValue={props?.values?.tags !== null ? props?.values?.tags : []}
        width="md"
        name="tags"
        label="Tags"
        mode="tags"
        placeholder="Tags"
      />
    </ModalForm>
  );
};

export default UpdateForm;
