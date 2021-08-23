import React from 'react';
import ProForm, { ProFormSelect, ProFormText, ModalForm } from '@ant-design/pro-form';
import { YesOrNo } from '@/components/Enums/Selects';

export type updateFormValueType = {
  isUnique?: boolean;
  mz?: number;
  protein?: string;
  rt?: number;
  id: string;
};

export type UpdateFormProps = {
  onSubmit: (values: updateFormValueType) => Promise<void>;
  onCancel: Record<string, () => void>;
  updateModalVisible: boolean;
  values: any;
  form: any;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  return (
    <ModalForm
      form={props.form}
      title="编辑肽段库"
      width={530}
      visible={props.updateModalVisible}
      modalProps={props.onCancel}
      onFinish={props.onSubmit}
    >
      <ProForm.Group>
        <ProFormText initialValue={props.values.mz} width="sm" name="mz" label="荷质比（m/z）" />
        <ProFormText initialValue={props.values.rt} width="sm" name="rt" label="RT" />
        <ProFormText
          disabled
          initialValue={props.values.proteinIdentifier}
          width="sm"
          name="protein"
          label="蛋白质标识符"
        />
        <ProFormSelect
          // initialValue={props.values.isUnique}
          options={YesOrNo}
          width="sm"
          name="isUnique"
          label="是否唯一"
        />
      </ProForm.Group>
    </ModalForm>
  );
};

export default UpdateForm;
