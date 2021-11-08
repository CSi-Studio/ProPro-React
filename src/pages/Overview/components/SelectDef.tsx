import React from 'react';
import { ModalForm } from '@ant-design/pro-form';
import { FormattedMessage, useIntl } from 'umi';

export type SelectDefProps = {
  onSubmit: () => Promise<void>;
  onCancel: () => void;
  selectDefVisible: boolean;
  selectedRows: any;
};

const SelectDefault: React.FC<SelectDefProps> = (props) => {
  const intl = useIntl();

  return (
    <ModalForm
      title={intl.formatMessage({
        id: 'table.switchDef',
        defaultMessage: '默认切换',
      })}
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
      <FormattedMessage id="component.switchDefNum" />
      {props.selectedRows.length}
    </ModalForm>
  );
};

export default SelectDefault;
