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
  onCancel: Record<string, () => void>;
  createModalVisible: boolean;
  values: Partial<any>;
  form: any;
};

// const [mode, setMode] = React.useState(true);

// const changeMode = value => {
//     setMode(value ? true : false);
// };

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const [createVisible, setCreate] = useState<boolean>(true);
  return (
    <ModalForm
      form={props.form}
      title="导入蛋白文件"
      width={530}
      visible={props.createModalVisible}
      modalProps={props.onCancel}
      onFinish={props.onSubmit}
    >
      <ProForm.Group>
        <ProFormText
          rules={[
            {
              required: false,
            },
          ]}
          width="sm"
          name="createTag"
          label="Tag"
          placeholder="请输入Tag"
        />
        <ProFormSelect
          rules={[
            {
              required: true,
              message: '请选择review类型',
            },
          ]}
          options={[
            {
              value: 'true',
              label: '已review',
            },
            {
              value: 'false',
              label: '未review',
            },
          ]}
          width="sm"
          name="reviewed"
          label="reviewed"
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
            支持的文件格式有：<Tag color="green">fasta</Tag>
          </p>
        }
        max={1}
        accept=".fasta"
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

      {/* <Switch onChange={changeMode} />  創建庫
         <Switch
          checked={input}
          checkedChildren="Input"
          unCheckedChildren="TextArea"
          onChange={() => {
            setInput(!input);
          }}
        /> */}

      <ProForm.Group>
        <ProFormSelect
          rules={[
            {
              required: true,
              message: '请选择是否新建库',
            },
          ]}
          options={[
            {
              value: 'true',
              label: '新建库',
            },
            {
              value: 'false',
              label: '不建库',
            },
          ]}
          width="sm"
          name="createLibrary"
          label="createLibrary"
          fieldProps={{
            onChange: (val) => {
              if (val == 'true') {
                setCreate(false);
              } else {
                setCreate(true);
              }
              console.log('status', createVisible);
            },
          }}

          // optionItemRender(item) {
          //   console.log(item.label+'-'+item.value)
          //   return item.label + ' - ' + item.value;
          // }
        />

        <ProFormText
          rules={[
            {
              required: true,
            },
          ]}
          width="sm"
          name="libraryName"
          label="libraryName"
          placeholder="请输入库名"
          hidden={createVisible}
        />

        <ProFormSelect
          rules={[
            {
              required: true,
              message: '请选择spModel',
            },
          ]}
          options={[
            {
              value: 'HCD',
              label: 'HCD',
            },
            {
              value: 'CID',
              label: 'CID',
            },
          ]}
          fieldProps={{ onChange: (val) => console.log('status', status) }}
          width="sm"
          name="spModel"
          label="spModel"
          hidden={createVisible}
        />
        <ProFormSelect
          rules={[
            {
              required: true,
              message: '请选择isoTope',
            },
          ]}
          options={[
            {
              value: 'true',
              label: '是的',
            },
            {
              value: 'false',
              label: '不是',
            },
          ]}
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
          placeholder="请输入minPepLen"
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
          placeholder="请输入maxPepLen"
          hidden={createVisible}
        />
      </ProForm.Group>
    </ModalForm>
  );
};

export default CreateForm;
