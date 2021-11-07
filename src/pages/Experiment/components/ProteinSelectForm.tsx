import React from 'react';
import ProForm, { ProFormSelect, ProFormText, ModalForm } from '@ant-design/pro-form';
import { useIntl } from 'umi';

export type selectFormValueType = {
  proteinName: string;
  LibraryId: string;
  range: any;
};

export type UpdateFormProps = {
  onClose: () => void;
  proteinSelectVisible: boolean;
  values: any;
  onSubmit: (values: selectFormValueType) => Promise<void>;
};

const newData: any[] = [];
const ProteinSelectForm: React.FC<UpdateFormProps> = (props) => {
  const intl = useIntl();

  props.values?.forEach((item: any) => {
    newData.push({ value: item, label: item });
  });
  return (
    <ModalForm
      title={intl.formatMessage({
        id: 'component.selectProInt',
        defaultMessage: '蛋白质选择界面',
      })}
      width={500}
      visible={props.proteinSelectVisible}
      modalProps={{
        maskClosable: false,
        onCancel: props.onClose,
      }}
      onFinish={props.onSubmit}
    >
      <ProForm.Group>
        <ProFormSelect
          options={newData}
          name={'proteinName'}
          placeholder={intl.formatMessage({
            id: 'component.selectProtein',
            defaultMessage: '请选择蛋白质名称',
          })}
          showSearch
          width={280}
          label={intl.formatMessage({
            id: 'component.proteinName',
            defaultMessage: '蛋白质名称',
          })}
          allowClear={true}
        />
        <ProFormText
          width="xs"
          name={'range'}
          label={intl.formatMessage({
            id: 'table.mzRange',
            defaultMessage: 'mz范围',
          })}
          placeholder={intl.formatMessage({
            id: 'component.inputMzRange',
            defaultMessage: '请输入mz范围',
          })}
        />
      </ProForm.Group>
    </ModalForm>
  );
};

export default ProteinSelectForm;
