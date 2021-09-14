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
  methodId?: string;
  tags?: Set<string>;
};

export type UpdateFormProps = {
  onSubmit: (values: updateFormValueType) => Promise<void>;
  onCancel: () => void;
  updateModalVisible: boolean;
  values: any;
  form: any;
};
const beforeAddData = await beforeAdd();
const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  return (
    <ModalForm
      form={props.form}
      title="更新标准库"
      width={800}
      visible={props.updateModalVisible}
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
        <ProFormSelect initialValue="DIA" width="sm" name="type" label="实验类型" />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          rules={[
            {
              pattern: /^.{0,20}$/,
              message: '负责人过长',
            },
          ]}
          initialValue={props.values.owner}
          width="sm"
          name="owner"
          label="负责人"
        />
        <ProFormText initialValue={props?.values?.group} width="sm" name="group" label="group" />
        <ProFormSelect
          initialValue={props?.values?.tags !== null ? props?.values?.tags : []}
          width="sm"
          name="tags"
          label="tags"
          mode="tags"
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          initialValue={props.values.anaLibName ? props.values.anaLibId : null}
          width="sm"
          name="anaLibId"
          label="标准库"
          request={async () => {
            const res: any[] = [];
            beforeAddData?.data.anaLibs.map((item: { name: any; id: any }) => {
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
          initialValue={props.values.insLibName ? props.values.insLibId : null}
          width="sm"
          name="insLibId"
          label="内标库"
          request={async () => {
            const res: any[] = [];
            beforeAddData?.data.insLibs.map((item: { name: any; id: any }) => {
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
          name="methodId"
          initialValue={props.values.methodId}
          label="方法包"
          request={async () => {
            const res: any[] = [];
            beforeAddData?.data.methods.map((item: { name: any; id: any }) => {
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
