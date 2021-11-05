import React from 'react';
import { ProFormText, ModalForm } from '@ant-design/pro-form';
import { Space } from 'antd';
import { Tag } from 'antd';
import { useIntl } from 'umi';

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
  const intl = useIntl();

  return (
    <ModalForm
      form={props.form}
      title={
        intl.formatMessage({
          id: 'component.deleteTaskNum',
          defaultMessage: '将要删除的任务的个数：',
        }) + props.selectedRows.length
      }
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
          {intl.formatMessage({
            id: 'component.pleaseInput',
            defaultMessage: '请输入',
          })}
          <Tag
            style={{
              margin: ' 0 2px',
              padding: '0 2px',
              fontSize: '14px',
              display: 'inline',
            }}
            color="red"
          >
            ok fine
          </Tag>
          {intl.formatMessage({
            id: 'component.used2delete',
            defaultMessage: '以确认删除。',
          })}
        </div>
        <ProFormText
          rules={[
            {
              required: true,
              message: '请输入ok fine',
            },
          ]}
          width="sm"
          name="name"
          placeholder="ok fine"
        />
      </Space>
    </ModalForm>
  );
};

export default DeleteForm;
