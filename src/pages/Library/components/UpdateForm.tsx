import React from 'react';
import ProForm, {
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ModalForm,
  ProFormUploadDragger,
} from '@ant-design/pro-form';

export type FormValueType = {
  name?: string;
  type?: string;
  file?: string;
  description?: string;
} & Partial<API.RuleListItem>;

export type UpdateFormProps = {
  onSubmit: (values: FormValueType) => Promise<void>;
  onCancel: Record<string, () => void>;
  updateModalVisible: boolean;
  values: Partial<API.RuleListItem>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  return (
    <ModalForm
      title="更新标准库"
      width={530}
      visible={props.updateModalVisible}
      modalProps={props.onCancel}
      onFinish={props.onSubmit}
    >
      <ProForm.Group>
        <ProFormText
          width="sm"
          name="name"
          label="库名称"
          tooltip="项目名称必须唯一"
          placeholder="请输入项目名称"
        />
        <ProFormSelect
          options={[
            {
              value: 'irtLibrary',
              label: 'iRT校准库',
            },
            {
              value: 'Library',
              label: '标准库',
            },
          ]}
          width="sm"
          name="type"
          label="库类型"
        />
      </ProForm.Group>
      <ProFormUploadDragger max={1} label="上传文件" name="upload" {...props} />
      <ProFormTextArea label="详情描述" name="description" />
    </ModalForm>
  );
};

export default UpdateForm;
