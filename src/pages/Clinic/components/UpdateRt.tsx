import React from 'react';
import ProForm, { ProFormSelect, ProFormText, ModalForm } from '@ant-design/pro-form';
import { useIntl } from 'umi';

export type updateRtType = {
  name?: string;
  type?: string;
  description?: string;
  id: string;
};

export type UpdateRtProps = {
  onSubmit: (values: updateRtType) => Promise<void>;
  onCancel: () => void;
  updateModalVisible: boolean;
  values: any;
  form: any;
};

const UpdateRt: React.FC<UpdateRtProps> = (props) => {
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
      </ProForm.Group>
    </ModalForm>
  );
};

export default UpdateRt;
