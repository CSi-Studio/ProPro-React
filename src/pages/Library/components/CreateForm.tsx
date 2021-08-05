import React from 'react';
import ProForm, {
  ProFormText,
  ModalForm,
  ProFormSelect,
  ProFormTextArea,
  ProFormUploadDragger,
} from '@ant-design/pro-form';
import { Button, Input, Space, Tabs } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
// 上传组件参数
const uploadConfig = {
  progress: {
    strokeColor: {
      '0%': '#108ee9',
      '100%': '#87d068',
    },
    strokeWidth: 3,
    format: (percent: number) => `${parseFloat(percent.toFixed(2))}%`,
  },
};

export type FormValueType = {
  name?: string;
  type?: string;
  filePath?: string;
  description?: string;
};

export type CreateFormProps = {
  onSubmit: (values: FormValueType) => Promise<void>;
  onCancel: Record<string, () => void>;
  createModalVisible: boolean;
  values: Partial<any>;
};

const CreateForm: React.FC<CreateFormProps> = (props) => {
  return (
    <ModalForm
      title="创建一个库"
      width={530}
      visible={props.createModalVisible}
      modalProps={props.onCancel}
      onFinish={props.onSubmit}
      submitter={{
        searchConfig: {
          resetText: '重置',
          submitText: '提交',
        },
        resetButtonProps: {
          style: {
            display: 'none',
          },
        },
        submitButtonProps: {},

        render: (prop) => {
          return [
            <Button danger key="rest" onClick={() => prop.form?.resetFields()}>
              重置
            </Button>,
            <Button type="primary" key="submit" onClick={() => prop.form?.submit?.()}>
              提交
            </Button>,
          ];
        },
      }}
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="手动上传" key="1">
          <ProForm.Group>
            <ProFormText
              rules={[
                {
                  required: true,
                  message: '库名字不能为空',
                },
              ]}
              width="sm"
              name="name"
              label="库名称"
              tooltip="项目名称必须唯一"
              placeholder="请输入项目名称"
            />
            <ProFormSelect
              rules={[
                {
                  required: true,
                  message: '库类型不能为空',
                },
              ]}
              options={[
                {
                  value: 'INS',
                  label: '内标库',
                },
                {
                  value: 'ANA',
                  label: '标准库',
                },
              ]}
              width="sm"
              name="type"
              label="库类型"
            />
          </ProForm.Group>
          <ProFormUploadDragger
            max={1}
            label="上传文件"
            name="filePath"
            {...uploadConfig}
            accept=".txt,.tsv,.csv,.xls,.xlsx"
          />
          <ProFormTextArea label="详情描述" name="description" />
        </TabPane>
        <TabPane tab="自动导入" key="2">
          <Space direction="vertical">
            <ProForm.Group>
              <ProFormText
                rules={[
                  {
                    required: true,
                    message: '库名字不能为空',
                  },
                ]}
                width="sm"
                name="name"
                label="库名称"
                tooltip="项目名称必须唯一"
                placeholder="请输入项目名称"
              />
              <ProFormSelect
                rules={[
                  {
                    required: true,
                    message: '库类型不能为空',
                  },
                ]}
                options={[
                  {
                    value: 'INS',
                    label: '内标库',
                  },
                  {
                    value: 'ANA',
                    label: '标准库',
                  },
                ]}
                width="sm"
                name="type"
                label="库类型"
              />
            </ProForm.Group>
            <div>文件地址</div>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <Space>
                <Input
                  style={{ height: '50px' }}
                  addonBefore="/Users/lihua/Downloads/"
                  defaultValue="mypath"
                />
                <Button
                  style={{ backgroundColor: '#0D93F7', color: 'white', marginBottom: '18px' }}
                  icon={<UploadOutlined />}
                >
                  上传
                </Button>
              </Space>
            </div>
            <ProFormTextArea label="详情描述" name="description" />
          </Space>
        </TabPane>
      </Tabs>
    </ModalForm>
  );
};

export default CreateForm;
