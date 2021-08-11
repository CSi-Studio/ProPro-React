import React from 'react';
import ProForm, {
  ProFormText,
  ModalForm,
  ProFormSelect,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { beforeAdd } from '../service';

export type addFormValueType = {
  name?: string;
  alias?: string;
  type?: string;
  owner?: string;
  anaLibId?: string;
  insLibId?: string;
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
      title="创建一个项目"
      width={530}
      visible={props.createModalVisible}
      modalProps={props.onCancel}
      onFinish={props.onSubmit}
    >
      <ProForm.Group>
        <ProFormSelect
          rules={[
            {
              required: true,
              message: '项目名称不能为空',
            },
          ]}
          width="sm"
          name="name"
          label="项目名称"
          tooltip="项目名称必须唯一"
          request={async () => {
            const params = await beforeAdd();
            const res: any[] = [];
            params.data.unloads.map((item: string) => {
              const temp: Record<any, any> = {};
              temp.label = item;
              temp.value = item;
              res.push(temp);
              return null;
            });
            return res;
          }}
        />
        <ProFormText width="sm" name="alias" label="项目别名" placeholder="请输入项目别名" />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText width="sm" name="type" label="实验类型" placeholder="请输入实验类型" />
        <ProFormText width="sm" name="owner" label="负责人" placeholder="请输入负责人" />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          rules={[
            {
              required: true,
              message: '项目名称不能为空',
            },
          ]}
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
      <ProFormTextArea name="description" label="项目描述" />
    </ModalForm>
  );
};

export default CreateForm;
