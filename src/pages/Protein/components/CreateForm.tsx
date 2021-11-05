import React, { useState } from 'react';
import ProForm, {
  ProFormText,
  ModalForm,
  ProFormSelect,
  ProFormUploadDragger,
  ProFormDigit,
} from '@ant-design/pro-form';
import { message, Tag } from 'antd';
import { Icon } from '@iconify/react';
import { ProteinType, SpModelType, YesOrNo } from '@/components/Enums/Selects';
import { useIntl, FormattedMessage } from 'umi';

export type addFormValueType = {
  createTage?: string;
  reviewed: boolean;
  filePath: string;
  createLibrary: boolean;
  libraryName?: string;
  spModel?: string;
  isotope?: boolean;
  minPepLen?: number;
  maxPepLen?: number;
};

export type CreateFormProps = {
  onSubmit: (values: addFormValueType) => Promise<void>;
  onCancel: () => void;
  createModalVisible: boolean;
  form: any;
};
const CreateForm: React.FC<CreateFormProps> = (props) => {
  const intl = useIntl();

  const [createVisible, setCreate] = useState<boolean>(true);
  return (
    <ModalForm
      form={props.form}
      title={intl.formatMessage({
        id: 'component.importProFile',
        defaultMessage: '导入蛋白文件',
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
      <ProForm.Group>
        <ProFormText
          initialValue=""
          rules={[
            {
              required: false,
            },
          ]}
          width="sm"
          name="createTag"
          label="Tag"
          placeholder="Input Tag"
        />
        <ProFormSelect
          rules={[
            {
              required: true,
              message: <FormattedMessage id="message.selectRevType" />,
            },
          ]}
          options={ProteinType.reviewed}
          width="sm"
          name="reviewed"
          label="reviewed"
        />
      </ProForm.Group>
      <ProFormUploadDragger
        rules={[
          {
            required: true,
            message: <FormattedMessage id="message.pleaseUploadPro" />,
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
          <p className="ant-upload-hint">
            <FormattedMessage id="message.fileFormat" />
            <Tag color="green">fasta</Tag>
          </p>
        }
        max={1}
        accept=".fasta"
        label={intl.formatMessage({
          id: 'message.fileFormat',
          defaultMessage: '上传文件',
        })}
        name="filePath"
        fieldProps={{
          beforeUpload: (info) => {
            return new Promise((resolve, reject) => {
              message.success(`Upload ${info.name}`);
              return reject(false);
            });
          },
        }}
      />
      <ProForm.Group>
        <ProFormSelect
          rules={[
            {
              required: true,
              message: <FormattedMessage id="message.whetherNewLib" />,
            },
          ]}
          options={ProteinType.createLibrary}
          width="sm"
          name="createLibrary"
          label="createLibrary"
          fieldProps={{
            onChange: (val) => {
              if (val === 'true') {
                setCreate(false);
              } else {
                setCreate(true);
              }
            },
          }}
        />

        <ProFormText
          rules={[
            {
              required: false,
            },
          ]}
          width="sm"
          name="libraryName"
          label="libraryName"
          placeholder={intl.formatMessage({
            id: 'message.inputLibraryName',
            defaultMessage: '请输入库名',
          })}
          hidden={createVisible}
        />

        <ProFormSelect
          rules={[
            {
              required: false,
              message: <FormattedMessage id="message.selectSpModel" />,
            },
          ]}
          options={SpModelType}
          width="sm"
          name="spModel"
          label="spModel"
          hidden={createVisible}
        />
        <ProFormSelect
          rules={[
            {
              required: false,
              message: <FormattedMessage id="message.selectIsoTope" />,
            },
          ]}
          options={YesOrNo}
          width="sm"
          name="isotope"
          label="isotope"
          hidden={createVisible}
        />
        <ProFormDigit
          rules={[
            {
              required: false,
            },
          ]}
          width="sm"
          name="minPepLen"
          label="minPepLen"
          placeholder={intl.formatMessage({
            id: 'message.inputMinPepLen',
            defaultMessage: '请输入minPepLen',
          })}
          hidden={createVisible}
        />
        <ProFormDigit
          rules={[
            {
              required: false,
            },
          ]}
          width="sm"
          name="maxPepLen"
          label="maxPepLen"
          placeholder={intl.formatMessage({
            id: 'message.inputMaxPepLen',
            defaultMessage: '请输入maxPepLen',
          })}
          hidden={createVisible}
        />
      </ProForm.Group>
    </ModalForm>
  );
};

export default CreateForm;
