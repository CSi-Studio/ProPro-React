import React from 'react';
import { ProFormTextArea, ProFormSelect, ModalForm } from '@ant-design/pro-form';
import { YesOrNo } from '@/components/Enums/Selects';
import { useIntl } from 'umi';

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
  batchModalVisible: boolean;
  form: any;
  values: any;
};
const BatchUpdateForm: React.FC<UpdateFormProps> = (props) => {
  const intl = useIntl();

  return (
    <ModalForm
      form={props.form}
      title={`${intl.formatMessage({
        id: 'component.editOvNum',
        defaultMessage: '修改OverView的个数',
      })}${props.values}`}
      width={400}
      visible={props.batchModalVisible}
      modalProps={{
        maskClosable: false,
        onCancel: () => {
          props.onCancel();
        },
      }}
      onFinish={props.onSubmit}
    >
      <ProFormSelect width="md" name="tags" label="Tags" mode="tags" />
      <ProFormSelect
        width="md"
        options={YesOrNo}
        name="defaultOne"
        label={intl.formatMessage({
          id: 'table.justDefault',
          defaultMessage: '仅默认',
        })}
      />
      <ProFormTextArea
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

export default BatchUpdateForm;
