import React from 'react';
import { ModalForm } from '@ant-design/pro-form';

export type SequenceProps = {
  onSubmit: () => Promise<void>;
  onCancel: () => void;
  sequenceVisible: boolean;
  currentRow: any;
};
const Sequence: React.FC<SequenceProps> = (props) => {
  return (
    <ModalForm
      visible={props.sequenceVisible}
      title="序列号"
      width={530}
      modalProps={{
        maskClosable: false,
        onCancel: () => {
          props.onCancel();
        },
      }}
      onFinish={props.onSubmit}
    >
      {props?.currentRow?.sequence}
    </ModalForm>
  );
};

export default Sequence;
