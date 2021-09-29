import React from 'react';
import ProForm, { ProFormText, ModalForm, ProFormSelect } from '@ant-design/pro-form';

export type BatchEditValueType = {
  ids: string[];
  fragMode: string;
  group: string;
  tags: Set<string>;
};

export type BatchEditProps = {
  onSubmit: (values: BatchEditValueType) => Promise<void>;
  onCancel: () => void;
  batchEditVisible: boolean;
  values: any;
  form: any;
};

const BatchEditForm: React.FC<BatchEditProps> = (props) => {
  return (
    <ModalForm
      form={props.form}
      title="更新实验信息"
      width={530}
      visible={props.batchEditVisible}
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
          initialValue={props?.values?.fragMode}
          width="sm"
          name="fragMode"
          label="碎片模式"
        />
        <ProFormText
          initialValue={props?.values?.group}
          width="sm"
          name="group"
          label="分组"
          placeholder="分组"
        />
      </ProForm.Group>
      <ProFormSelect
        initialValue={props?.values?.tags !== null ? props?.values?.tags : []}
        width="md"
        name="tags"
        label="标签"
        mode="tags"
        placeholder="Tags"
      />
    </ModalForm>
  );
};

export default BatchEditForm;
