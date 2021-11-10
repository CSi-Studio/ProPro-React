import React from 'react';
import ProForm, {
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ModalForm,
} from '@ant-design/pro-form';
import { LibraryType } from '@/components/Enums/Selects';
import { useIntl, FormattedMessage } from 'umi';

export type updateFormValueType = {
  name?: string;
  type?: string;
  description?: string;
  id: string;
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
        id: 'component.updateLibrary',
        defaultMessage: '更新标准库',
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
          disabled
          initialValue={props.values.name}
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
          initialValue={props.values.type}
          options={LibraryType}
          width="sm"
          name="type"
          label={intl.formatMessage({
            id: 'table.libraryType',
            defaultMessage: '库类型',
          })}
        />
      </ProForm.Group>

      <ProFormTextArea
        initialValue={
          props.values.description && props.values.description !== 'undefined'
            ? props.values.description
            : ''
        }
        label={intl.formatMessage({
          id: 'component.detailDescription',
          defaultMessage: '详情描述',
        })}
        name="description"
      />
    </ModalForm>
  );
};

export default UpdateForm;
