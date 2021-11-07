import React from 'react';
import ProForm, { ProFormText, ModalForm, ProFormSelect } from '@ant-design/pro-form';
import { useIntl } from 'umi';

export type updateFormValueType = {
  alias?: string;
  id: string;
  fragMode: string;
  group: string;
  tags: string;
};

export type UpdateFormProps = {
  onSubmit: (values: updateFormValueType) => Promise<void>;
  onCancel: () => void;
  updateModalVisible: boolean;
  values: any;
  form: any;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const intl = useIntl();

  return (
    <ModalForm
      form={props.form}
      title={intl.formatMessage({
        id: 'component.updateExpInf',
        defaultMessage: '更新实验信息',
      })}
      width={530}
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
          initialValue={props?.values?.alias}
          width="sm"
          name="alias"
          label={intl.formatMessage({
            id: 'table.alias',
            defaultMessage: '别名',
          })}
          placeholder={intl.formatMessage({
            id: 'table.alias',
            defaultMessage: '别名',
          })}
        />
        <ProFormText
          initialValue={props?.values?.group}
          width="sm"
          name="group"
          label={intl.formatMessage({
            id: 'table.group',
            defaultMessage: '分组',
          })}
          placeholder={intl.formatMessage({
            id: 'table.group',
            defaultMessage: '分组',
          })}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          initialValue={props?.values?.fragMode}
          width="sm"
          name="fragMode"
          label={intl.formatMessage({
            id: 'table.fragmentMode',
            defaultMessage: '碎片模式',
          })}
          placeholder={intl.formatMessage({
            id: 'table.fragmentMode',
            defaultMessage: '碎片模式',
          })}
        />
      </ProForm.Group>
      <ProFormSelect
        initialValue={props?.values?.tags !== null ? props?.values?.tags : []}
        width="md"
        name="tags"
        label={intl.formatMessage({
          id: 'table.tags',
          defaultMessage: '标签',
        })}
        mode="tags"
        placeholder={intl.formatMessage({
          id: 'table.tags',
          defaultMessage: '标签',
        })}
      />
    </ModalForm>
  );
};

export default UpdateForm;
