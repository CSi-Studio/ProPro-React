import React from 'react';
import { ProFormText, ModalForm } from '@ant-design/pro-form';
import { Space } from 'antd';
import { Tag } from 'antd';

export type FormValueType = {
  name?: string;
};

export type DeleteFormProps = {
  onSubmit: (value: FormValueType) => Promise<void>;
  onCancel: Record<string, () => void>;
  deleteModalVisible: boolean;
  values: any;
  form: any;
  currentRow: any;
};

const DeleteForm: React.FC<DeleteFormProps> = (props) => {
  return (
    <ModalForm
      form={props.form}
      title="你确定要删除吗？"
      width={530}
      visible={props.deleteModalVisible}
      modalProps={props.onCancel}
      onFinish={props.onSubmit}
    >
      <Space direction="vertical" style={{ textAlign: 'center', width: '100%' }}>
        <div style={{ marginTop: '24px' }}>
          请输入
          <Tag
            style={{
              margin: ' 0 2px',
              padding: '0 2px',
              fontSize: '14px',
              display: 'inline',
            }}
            color="red"
          >
            {props?.currentRow?.peptideRef}
          </Tag>
          以确认删除。
        </div>
        <ProFormText
          rules={[
            {
              required: true,
              message: '请输入要删除的peptideRef',
            },
          ]}
          width="sm"
          name="name"
          placeholder="请输入要删除的peptideRef"
        />
      </Space>
    </ModalForm>
  );
};

export default DeleteForm;
