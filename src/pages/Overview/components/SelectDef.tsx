import React from 'react';
import { ModalForm } from '@ant-design/pro-form';

export type SelectDefProps = {
  onSubmit: () => Promise<void>;
  onCancel: () => void;
  selectDefVisible: boolean;
  selectedRows: any;
};

const SelectDefault: React.FC<SelectDefProps> = (props) => {
  return (
    <ModalForm
      title={`选择是否默认`}
      width={530}
      visible={props.selectDefVisible}
      modalProps={{
        maskClosable: false,
        onCancel: () => {
          props.onCancel();
        },
      }}
      onFinish={props.onSubmit}
    >
      你确定要将这{props.selectedRows.length}个概览的默认值转为 Yes 吗？
    </ModalForm>
  );
};

export default SelectDefault;
