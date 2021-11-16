import React from 'react';
import ProForm, {
  ProFormText,
  ModalForm,
  ProFormSelect,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { beforeAdd } from '../service';
import PSelect from '@/components/PDictSelect/PDictSelect';
import { useIntl } from 'umi';

export type addFormValueType = {
  name?: string;
  alias?: string;
  type?: string;
  owner?: string;
  anaLibId?: string;
  insLibId?: string;
  methodId?: string;
  description?: string;
  tags?: Set<string>;
};

export type CreateFormProps = {
  onSubmit: (values: addFormValueType) => Promise<void>;
  onCancel: () => void;
  createModalVisible: boolean;
  values: Partial<any>;
  form: any;
};

const beforeAddData = await beforeAdd();
const CreateForm: React.FC<CreateFormProps> = (props) => {
  const intl = useIntl();

  return (
    <ModalForm
      form={props.form}
      title={intl.formatMessage({
        id: 'component.createProject',
        defaultMessage: '创建项目',
      })}
      width={800}
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
        <ProFormSelect
          rules={[
            {
              required: true,
              message: `${intl.formatMessage({
                id: 'component.emptyProjectName',
                defaultMessage: '项目名称不能为空',
              })}`,
            },
          ]}
          width="sm"
          name="name"
          label={intl.formatMessage({
            id: 'component.projectName',
            defaultMessage: '项目名称',
          })}
          tooltip={intl.formatMessage({
            id: 'component.UniProjectName',
            defaultMessage: '项目名称必须唯一',
          })}
          request={async () => {
            const res: any[] = [];
            beforeAddData?.data.unloads.map((item: string) => {
              const temp: Record<any, any> = {};
              temp.label = item;
              temp.value = item;
              res.push(temp);
              return null;
            });
            return res;
          }}
        />
        <ProFormText
          width="sm"
          name="alias"
          label={intl.formatMessage({
            id: 'component.projectAlias',
            defaultMessage: '项目别名',
          })}
          placeholder={intl.formatMessage({
            id: 'component.inputProjectAlias',
            defaultMessage: '请输入项目别名',
          })}
        />
        <PSelect
          name="type"
          dictName="ProjectType"
          label={intl.formatMessage({
            id: 'component.runType',
            defaultMessage: 'Run类型',
          })}
          placeholder={intl.formatMessage({
            id: 'component.inputRunType',
            defaultMessage: '请输入Run类型',
          })}
          initialValue="DIA"
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          rules={[
            {
              required: true,
              message: `${intl.formatMessage({
                id: 'component.directorEmpty',
                defaultMessage: '负责人不能为空',
              })}`,
            },
            {
              pattern: /^.{1,20}$/,
              message: `${intl.formatMessage({
                id: 'component.directorNameLong',
                defaultMessage: '负责人名字过长',
              })}`,
            },
          ]}
          width="sm"
          name="owner"
          label={intl.formatMessage({
            id: 'component.director',
            defaultMessage: '负责人',
          })}
          placeholder={intl.formatMessage({
            id: 'component.directorInput',
            defaultMessage: '请输入负责人',
          })}
        />
        <ProFormText width="sm" name="group" label="Group" />
        <ProFormSelect width="sm" name="tags" label="Tags" mode="tags" />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          width="sm"
          name="anaLibId"
          label={intl.formatMessage({
            id: 'table.standardLibrary',
            defaultMessage: '标准库',
          })}
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
          width="sm"
          name="insLibId"
          label={intl.formatMessage({
            id: 'table.innerLibrary',
            defaultMessage: '内标库',
          })}
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
          label={intl.formatMessage({
            id: 'table.methodPackage',
            defaultMessage: '方法包',
          })}
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
        name="description"
        label={intl.formatMessage({
          id: 'component.projectDescription',
          defaultMessage: '项目描述',
        })}
      />
    </ModalForm>
  );
};

export default CreateForm;
