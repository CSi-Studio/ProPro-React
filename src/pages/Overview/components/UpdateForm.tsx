import React from 'react';
import { ProFormTextArea, ProFormSelect, ProFormText, ModalForm } from '@ant-design/pro-form';
import { YesOrNo } from '@/components/Enums/Selects';
import { useIntl, FormattedMessage } from 'umi';

export type updateFormValueType = {
  name?: string;
  id: string;
  tags?: any;
  note?: string;
  defaultOne?: boolean;
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
        id: 'component.editOverview',
        defaultMessage: '编辑概览',
      })}
      width={400}
      visible={props.updateModalVisible}
      modalProps={{
        maskClosable: false,
        onCancel: () => {
          props.onCancel();
        },
      }}
      onFinish={props.onSubmit}
    >
      <ProFormText
        rules={[
          {
            required: true,
            message: <FormattedMessage id="component.emptyProjectName" />,
          },
        ]}
        disabled
        initialValue={props.values.name}
        width="md"
        name="name"
        label={intl.formatMessage({
          id: 'table.ovName',
          defaultMessage: '概览名',
        })}
        tooltip={intl.formatMessage({
          id: 'component.ovNameUni',
          defaultMessage: '概览名必须唯一',
        })}
      />
      <ProFormSelect
        initialValue={props.values.tags}
        width="md"
        name="tags"
        label="tags"
        mode="tags"
      />
      <ProFormSelect
        initialValue={props.values.defaultOne}
        width="md"
        options={YesOrNo}
        name="defaultOne"
        label={intl.formatMessage({
          id: 'component.defaultOne',
          defaultMessage: '是否为默认结果',
        })}
      />
      <ProFormTextArea
        initialValue={props.values.note}
        width="md"
        name="note"
        label={intl.formatMessage({
          id: 'component.note',
          defaultMessage: '标注',
        })}
      />
    </ModalForm>
  );
};

export default UpdateForm;
