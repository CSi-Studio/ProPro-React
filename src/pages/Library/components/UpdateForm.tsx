import React from 'react';
import ProForm, {
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ModalForm,
} from '@ant-design/pro-form';
import { LibraryType } from '@/components/Enums/Selects';

export type updateFormValueType = {
  name?: string;
  type?: string;
  description?: string;
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
      title="更新标准库"
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
          disabled
          initialValue={props.values.name}
          width="sm"
          name="name"
          label="库名称"
          tooltip="项目名称必须唯一"
          placeholder="请输入项目名称"
        />
        <ProFormSelect
          initialValue={props.values.type}
          options={LibraryType}
          width="sm"
          name="type"
          label="库类型"
        />
      </ProForm.Group>

      <ProFormTextArea
        initialValue={props.values.description === undefined ? '' : props.values.description}
        label="详情描述"
        name="description"
      />
    </ModalForm>
  );
};

export default UpdateForm;
