import React from 'react';
import { ProFormText, ModalForm } from '@ant-design/pro-form';
import { Space } from 'antd';

export type FormValueType = {
  name?: string;
  type?: string;
  file?: string;
  description?: string;
} & Partial<API.RuleListItem>;

export type DeleteFormProps = {
  onSubmit: (values: FormValueType) => Promise<void>;
  onCancel: Record<string, () => void>;
  deleteModalVisible: boolean;
  values: Partial<API.RuleListItem>;
};

const DeleteForm: React.FC<DeleteFormProps> = (props) => {
  return (
    <ModalForm
      title="你确定要删除吗？"
      width={530}
      visible={props.deleteModalVisible}
      modalProps={props.onCancel}
      onFinish={props.onSubmit}
    >
      <Space direction="vertical" style={{ textAlign: 'center', width: '100%' }}>
        <div style={{ marginTop: '24px' }}>
          请输入"<strong>我确认删除</strong>"来删除该标准库
        </div>
        <ProFormText width="sm" name="name" placeholder="我确认删除" />
      </Space>
    </ModalForm>
  );
};

export default DeleteForm;
