import React from 'react';
import ProForm, {
  ProFormText,
  ModalForm,
  ProFormSelect,
  ProFormTextArea,
  ProFormUploadDragger,
} from '@ant-design/pro-form';
import { Button, Input, Space, Tabs, Tag } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Icon } from '@iconify/react';
import { LibraryType } from '@/components/Enums/Selects';
import { useIntl, FormattedMessage } from 'umi';

const { TabPane } = Tabs;
export type addFormValueType = {
  name?: string;
  type?: string;
  filePath?: string;
  description?: string;
};

export type CreateFormProps = {
  onSubmit: (values: addFormValueType) => Promise<void>;
  onCancel: () => void;
  createModalVisible: boolean;
  values: Partial<any>;
  form: any;
};

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const intl = useIntl();

  return (
    <ModalForm
      form={props.form}
      title={intl.formatMessage({
        id: 'component.createLibrary',
        defaultMessage: '创建库',
      })}
      width={530}
      visible={props.createModalVisible}
      modalProps={{
        maskClosable: false,
        onCancel: () => {
          props.onCancel();
        },
      }}
      onFinish={props.onSubmit}
    >
      <Tabs defaultActiveKey="1">
        <TabPane
          tab={intl.formatMessage({
            id: 'component.manualUpload',
            defaultMessage: '手动上传',
          })}
          key="1"
        >
          <ProForm.Group>
            <ProFormText
              rules={[
                {
                  required: true,
                  message: <FormattedMessage id="component.libraryNameNull" />,
                },
              ]}
              width="sm"
              name="name"
              label={intl.formatMessage({
                id: 'component.libraryName',
                defaultMessage: '库名称',
              })}
              tooltip={intl.formatMessage({
                id: 'component.libraryNameUni',
                defaultMessage: '库名称必须唯一',
              })}
            />
            <ProFormSelect
              rules={[
                {
                  required: true,
                  message: <FormattedMessage id="component.libraryTypeNull" />,
                },
              ]}
              options={LibraryType}
              width="sm"
              name="type"
              label={intl.formatMessage({
                id: 'table.libraryType',
                defaultMessage: '库类型',
              })}
            />
          </ProForm.Group>
          <ProFormUploadDragger
            rules={[
              {
                required: true,
                message: <FormattedMessage id="component.uploadFiles" />,
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
            title={intl.formatMessage({
              id: 'message.uploadFileArea',
              defaultMessage: '点击或者拖动文件到此区域',
            })}
            description={
              <span className="ant-upload-hint">
                <FormattedMessage id="message.fileFormat" />：<Tag color="green">txt</Tag>
                <Tag color="green">tsv</Tag>
                <Tag color="green">tsv</Tag>
                <Tag color="green">csv</Tag>
                <Tag color="green">xls</Tag>
                <Tag color="green">xlsx</Tag>
                <Tag color="green">TraML</Tag>
              </span>
            }
            max={1}
            accept=".txt,.tsv,.csv,.xls,.xlsx,.TraML"
            label={intl.formatMessage({
              id: 'message.fileFormat',
              defaultMessage: '上传文件',
            })}
            name="filePath"
            fieldProps={{
              beforeUpload: () => {
                return new Promise((resolve, reject) => {
                  return reject(false);
                });
              },
            }}
          />

          <ProFormTextArea
            label={intl.formatMessage({
              id: 'component.detailDescription',
              defaultMessage: '详情描述',
            })}
            name="description"
          />
        </TabPane>
        <TabPane
          tab={intl.formatMessage({
            id: 'component.autoImport',
            defaultMessage: '自动导入',
          })}
          key="2"
        >
          <Space direction="vertical">
            <ProForm.Group>
              <ProFormText
                rules={[
                  {
                    required: true,
                    message: <FormattedMessage id="component.libraryNameNull" />,
                  },
                ]}
                width="sm"
                name="name"
                label={intl.formatMessage({
                  id: 'component.libraryName',
                  defaultMessage: '库名称',
                })}
                tooltip={intl.formatMessage({
                  id: 'component.libraryNameUni',
                  defaultMessage: '库名称必须唯一',
                })}
              />
              <ProFormSelect
                rules={[
                  {
                    required: true,
                    message: <FormattedMessage id="component.uploadFiles" />,
                  },
                ]}
                options={LibraryType}
                width="sm"
                name="type"
                label={intl.formatMessage({
                  id: 'table.libraryType',
                  defaultMessage: '库类型',
                })}
              />
            </ProForm.Group>
            <div>
              <FormattedMessage id="component.fileAddress" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <Space>
                <Input
                  style={{ height: '50px' }}
                  addonBefore="/Users/lihua/Downloads/"
                  defaultValue="myPath"
                />
                <Button
                  style={{ backgroundColor: '#0D93F7', color: 'white', marginBottom: '18px' }}
                  icon={<UploadOutlined />}
                >
                  <FormattedMessage id="component.upload" />
                </Button>
              </Space>
            </div>
            <ProFormTextArea
              label={intl.formatMessage({
                id: 'component.detailDescription',
                defaultMessage: '详情描述',
              })}
              name="description"
            />
          </Space>
        </TabPane>
      </Tabs>
    </ModalForm>
  );
};

export default CreateForm;
