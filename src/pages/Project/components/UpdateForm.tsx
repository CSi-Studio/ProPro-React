import React from 'react';
import ProForm, {
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ModalForm,
} from '@ant-design/pro-form';
import { beforeAdd } from '../service';

export type updateFormValueType = {
  name?: string;
  type?: string;
  description?: string;
  id: string;
  owner?: string;
  alias?: string;
  anaLibId?: string;
  insLibId?: string;
};

export type UpdateFormProps = {
  onSubmit: (values: updateFormValueType) => Promise<void>;
  onCancel: Record<string, () => void>;
  updateModalVisible: boolean;
  values: any;
  form: any;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  return (
    <ModalForm
      form={props.form}
      title="更新标准库"
      width={530}
      visible={props.updateModalVisible}
      modalProps={props.onCancel}
      onFinish={props.onSubmit}
    >
      <ProForm.Group>
        <ProFormText
          rules={[
            {
              required: true,
              message: '项目名称不能为空',
            },
          ]}
          disabled
          initialValue={props.values.name}
          width="sm"
          name="name"
          label="库名称"
          tooltip="项目名称必须唯一"
        />
        <ProFormText initialValue={props.values.alias} width="sm" name="alias" label="项目别名" />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText initialValue={props.values.owner} width="sm" name="owner" label="负责人" />
        <ProFormSelect initialValue="DIA" width="sm" name="type" label="实验类型" />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          rules={[
            {
              required: true,
              message: '标准库不能为空',
            },
          ]}
          initialValue={props.values.anaLibName}
          width="sm"
          name="anaLibId"
          label="标准库"
          request={async () => {
            const params = await beforeAdd();
            const res: any[] = [];
            params.data.anaLibs.map((item: { name: any; id: any }) => {
              const temp: Record<any, any> = {};
              temp.label = item.name;
              temp.value = item.id;
              res.push(temp);
              return null;
            });
            return res;
          }}
        />
        <ProFormSelect
          rules={[
            {
              required: true,
              message: '内标库不能为空',
            },
          ]}
          initialValue={props.values.insLibName}
          width="sm"
          name="insLibId"
          label="内标库"
          request={async () => {
            const params = await beforeAdd();
            const res: any[] = [];
            params.data.insLibs.map((item: { name: any; id: any }) => {
              const temp: Record<any, any> = {};
              temp.label = item.name;
              temp.value = item.id;
              res.push(temp);
              return null;
            });
            return res;
          }}
        />
      </ProForm.Group>
      <ProFormTextArea
        initialValue={props.values.description}
        label="详情描述"
        name="description"
      />
    </ModalForm>
  );
};

export default UpdateForm;
