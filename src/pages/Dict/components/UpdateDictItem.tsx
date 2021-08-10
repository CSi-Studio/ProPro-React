import React from 'react';
import ProForm, {
  ProFormTextArea,
  ModalForm,
} from '@ant-design/pro-form';

export type updateFormValueType = {
  key?:string;
  value?:string
};

export type UpdateFormProps = {
  onSubmit: (values: updateFormValueType) => Promise<void>;
  onCancel: Record<string, () => void>;
  updateModalVisible: boolean;
  values: any;
  form: any;
};

export type updateFormValue = {
    id:string;
    key: any;
    value: any;
  };

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  return (
    <ModalForm
      form={props.form}
      title="更新字典值"
      width={530}
      visible={props.updateModalVisible}
      modalProps={props.onCancel}
      onFinish={props.onSubmit}
    >
      <ProFormTextArea
        initialValue={props.values.description}
        label="key值"
        name="key"
      />
      <ProFormTextArea
        initialValue={props.values.description}
        label="value值"
        name="value"
      />
    </ModalForm>
  );
};

export default UpdateForm;