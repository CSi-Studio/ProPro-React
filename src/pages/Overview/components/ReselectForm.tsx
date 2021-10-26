import React from 'react';
import { ModalForm } from '@ant-design/pro-form';

export type ReselectFormProps = {
  onSubmit: () => Promise<void>;
  onCancel: () => void;
  reselectVisible: boolean;
  form: any;
  selectedRows: any;
};

const ReselectForm: React.FC<ReselectFormProps> = (props) => {
  return (
    <ModalForm
      form={props.form}
      title={`Reselect概览`}
      width={530}
      visible={props.reselectVisible}
      modalProps={{
        maskClosable: false,
        onCancel: () => {
          props.onCancel();
        },
      }}
      onFinish={props.onSubmit}
    >
      你确定要Reselect这{props.selectedRows.length}个概览吗？
    </ModalForm>
  );
};

export default ReselectForm;
