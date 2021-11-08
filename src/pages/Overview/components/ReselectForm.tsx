import React from 'react';
import { ModalForm } from '@ant-design/pro-form';
import { FormattedMessage } from 'umi';

export type ReselectFormProps = {
  onSubmit: () => Promise<void>;
  onCancel: () => void;
  reselectVisible: boolean;
  selectedRows: any;
};

const ReselectForm: React.FC<ReselectFormProps> = (props) => {
  return (
    <ModalForm
      title={`Reselect`}
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
      <FormattedMessage id="component.reSelectNum" />
      {props.selectedRows.length}
    </ModalForm>
  );
};

export default ReselectForm;
