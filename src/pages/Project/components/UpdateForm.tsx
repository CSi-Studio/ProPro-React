import React from 'react';
import ProForm, {
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ModalForm,
} from '@ant-design/pro-form';
import { beforeAdd } from '../service';
import { useIntl } from 'umi';

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
  const intl = useIntl();

  return (
    <ModalForm
      form={props.form}
      title={intl.formatMessage({
        id: 'component.updateLibrary',
        defaultMessage: '更新标准库',
      })}
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
              message: `${intl.formatMessage({
                id: 'component.emptyProjectName',
                defaultMessage: '项目名称不能为空',
              })}`,
            },
          ]}
          disabled
          initialValue={props.values.name}
          width="sm"
          name="name"
          label={intl.formatMessage({
            id: 'component.libraryName',
            defaultMessage: '库名称',
          })}
          tooltip={intl.formatMessage({
            id: 'component.UniProjectName',
            defaultMessage: '项目名称必须唯一',
          })}
        />
        <ProFormText
          initialValue={props.values.alias}
          width="sm"
          name="alias"
          label={intl.formatMessage({
            id: 'component.projectAlias',
            defaultMessage: '项目别名',
          })}
        />
        <ProFormSelect
          initialValue="DIA"
          width="sm"
          name="type"
          label={intl.formatMessage({
            id: 'component.runType',
            defaultMessage: 'Run类型',
          })}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          rules={[
            {
              pattern: /^.{0,20}$/,
              message: `${intl.formatMessage({
                id: 'component.directorNameLong',
                defaultMessage: '负责人名字过长',
              })}`,
            },
          ]}
          initialValue={props.values.owner}
          width="sm"
          name="owner"
          label={intl.formatMessage({
            id: 'component.director',
            defaultMessage: '负责人',
          })}
        />
        <ProFormText initialValue={props?.values?.group} width="sm" name="group" label="Group" />
        <ProFormSelect
          initialValue={props?.values?.tags !== null ? props?.values?.tags : []}
          width="sm"
          name="tags"
          label="Tags"
          mode="tags"
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          initialValue={props.values.anaLibName ? props.values.anaLibId : null}
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
          initialValue={props.values.insLibName ? props.values.insLibId : null}
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
          initialValue={props.values.methodId}
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
        initialValue={props.values.description}
        label={intl.formatMessage({ 
          id: 'component.projectDescription',
          defaultMessage: '项目描述:',
        })}
        name="description"
      />
    </ModalForm>
  );
};

export default UpdateForm;
