import React from 'react';
import ProForm, { ProFormSelect, ProFormText, ModalForm } from '@ant-design/pro-form';

export type selectFormValueType = {
  proteinName: string;
  LibraryId: string;
  range: any;
};

export type UpdateFormProps = {
  onClose: () => void;
  proteinSelectVisible: boolean;
  values: any;
  onSubmit: (values: selectFormValueType) => Promise<void>;
};

let newData: any[] = [];
const ProteinSelectForm: React.FC<UpdateFormProps> = (props) => {
  props.values?.map((item: any, index: number) => {
    newData.push({ value: item, label: item });
  });
  return (
    <ModalForm
      title="蛋白质选择界面"
      width={800}
      visible={props.proteinSelectVisible}
      modalProps={{
        maskClosable: false,
        onCancel: props.onClose,
      }}
      onFinish={props.onSubmit}
    >
      <ProForm.Group>
        <ProFormSelect
          initialValue={false}
          options={newData}
          name={'proteinName'}
          placeholder="请选择蛋白质名称"
          showSearch
          width={280}
          label="蛋白质名称"
          allowClear={true}
        />
        <ProFormText width="sm" name={'range'} label="mz范围" placeholder="请输入mz范围" />
      </ProForm.Group>
    </ModalForm>
  );
};

export default ProteinSelectForm;
