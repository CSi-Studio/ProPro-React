import React from 'react';
import { ModalForm } from '@ant-design/pro-form';
import { useIntl } from 'umi';

export type SequenceProps = {
  onSubmit: () => Promise<void>;
  onCancel: () => void;
  sequenceVisible: boolean;
  currentRow: any;
};
const Sequence: React.FC<SequenceProps> = (props) => {
  const intl = useIntl(); // 国际化

  return (
    <ModalForm
      visible={props.sequenceVisible}
      title={intl.formatMessage({
        id: 'table.sequence',
        defaultMessage: '序列号',
      })}
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
