import React from 'react';
import { ProFormText, ModalForm } from '@ant-design/pro-form';
import { Space } from 'antd';
import { Tag } from 'antd';

export type FormValueType = {
  name?: string;
};

export type DeleteFormProps = {
  onSubmit: (value: FormValueType) => Promise<void>;
  onCancel: () => void;
  deleteModalVisible: boolean;
  form: any;
  selectedRows: any;
};

const DeleteForm: React.FC<DeleteFormProps> = (props) => {
  return (
    <ModalForm
      form={props.form}
      title={'你确定要删除这' + props.selectedRows.length + '个任务吗？'}
      width={530}
      visible={props.deleteModalVisible}
      modalProps={{
        maskClosable: false,
        onCancel: () => {
          props.onCancel();
        },
      }}
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
            我确认删除
          </Tag>
          以确认
        </div>
        <ProFormText
          rules={[
            {
              required: true,
              message: '请输入我确认删除',
            },
          ]}
          width="sm"
          name="name"
          placeholder="请输入我确认删除"
        />
      </Space>
    </ModalForm>
  );
};

export default DeleteForm;
