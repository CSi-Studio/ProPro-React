import React from 'react';
import { ProFormTextArea, ProFormSelect, ProFormText, ModalForm } from '@ant-design/pro-form';
import { YesOrNo } from '@/components/Enums/Selects';

export type updateFormValueType = {
  name?: string;
  id: string;
  tags?: any;
  note?: string;
  defaultOne?: boolean;
};

export type UpdateFormProps = {
  onSubmit: (values: updateFormValueType) => Promise<void>;
  onCancel: () => void;
  batchModalVisible: boolean;
  form: any;
  values: any;
};
const BatchUpdateForm: React.FC<UpdateFormProps> = (props) => {
  return (
    <ModalForm
      form={props.form}
      title={`更新${props.values}个概览`}
      width={400}
      visible={props.batchModalVisible}
      modalProps={{
        maskClosable: false,
        onCancel: () => {
          props.onCancel();
        },
      }}
      onFinish={props.onSubmit}
    >
      <ProFormSelect width="md" name="tags" label="tags" mode="tags" />
      <ProFormSelect width="md" options={YesOrNo} name="defaultOne" label="是否为默认结果" />
      <ProFormTextArea width="md" name="note" label="标注" />
    </ModalForm>
  );
};

export default BatchUpdateForm;
