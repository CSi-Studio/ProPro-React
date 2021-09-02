import React from 'react';
import  { ProFormTextArea, ProFormSelect, ProFormText, ModalForm } from '@ant-design/pro-form';
import { YesOrNo } from '@/components/Enums/Selects';

export type updateFormValueType = {
  name?: string;
  id: string;
  tags?: any;
  note?: string;
  defaultOne?:boolean;
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
      title="更新概览"
      width={400}
      visible={props.updateModalVisible}
      modalProps={{
        maskClosable: false,
        onCancel: () => {
          props.onCancel();
        },
      }}
      onFinish={props.onSubmit}
    >
        <ProFormText
          rules={[
            {
              required: true,
              message: '项目名称不能为空',
            },
          ]}
          disabled
          initialValue={props.values.name}
          width="md"
          name="name"
          label="概览名"
          tooltip="概览名必须唯一"
        />
        <ProFormSelect
          initialValue={props.values.tags}
          width="md"
          name="tags"
          label="tags"
          mode="tags"
        />
         <ProFormSelect
          initialValue={props.values.defaultOne}
          width="md"
          options={YesOrNo}
          name="defaultOne"
          label="是否为默认结果"
        />
        <ProFormTextArea initialValue={props.values.note} width="md" name="note" label="标注" />
  
    </ModalForm>
  );
};

export default UpdateForm;
