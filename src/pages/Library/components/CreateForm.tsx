/* eslint-disable no-console */
import React from 'react';
import ProForm, {
  ProFormText,
  ModalForm,
  ProFormSelect,
  ProFormTextArea,
  ProFormUploadDragger,
} from '@ant-design/pro-form';
import { Button, Form, Input, message, Space, Tabs, Tag } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Dragger from 'antd/lib/upload/Dragger';
import { Icon } from '@iconify/react';

const { TabPane } = Tabs;
export type addFormValueType = {
  name?: string;
  type?: string;
  filePath?: string;
  description?: string;
};

export type CreateFormProps = {
  onSubmit: (values: addFormValueType) => Promise<void>;
  onCancel: Record<string, () => void>;
  createModalVisible: boolean;
  values: Partial<any>;
  form: any;
};

const CreateForm: React.FC<CreateFormProps> = (props) => {
  return (
    <ModalForm
      form={props.form}
      title="创建一个库"
      width={530}
      visible={props.createModalVisible}
      modalProps={props.onCancel}
      onFinish={props.onSubmit}
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
            rules={[
              {
                required: true,
                message: '不传文件，你手写库内容吗？ 😅',
              },
            ]}
            icon={
              <Icon
                style={{
                  textAlign: 'center',
                  fontSize: '50px',
                  color: '#0D93F7',
                  marginBottom: '-25px',
                }}
                icon="mdi:cloud-upload"
              />
            }
            title="点击或者拖动文件到此区域"
            description={
              <p className="ant-upload-hint">
                支持的文件格式有：<Tag color="green">txt</Tag>
                <Tag color="green">tsv</Tag>
                <Tag color="green">tsv</Tag>
                <Tag color="green">csv</Tag>
                <Tag color="green">xls</Tag>
                <Tag color="green">xlsx</Tag>
                <Tag color="green">TraML</Tag>
              </p>
            }
            max={1}
            accept=".txt,.tsv,.csv,.xls,.xlsx,.TraML"
            label="上传文件"
            name="filePath"
            fieldProps={{
              beforeUpload: (info) => {
                return new Promise((resolve, reject) => {
                  message.success(`您将要上传的是 ${info.name}， 🤏 您配吗`);
                  // eslint-disable-next-line prefer-promise-reject-errors
                  return reject(false);
                });
              },
            }}
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
