import React from 'react';
import { ProFormText, ModalForm, ProFormSelect } from '@ant-design/pro-form';
import { Button } from 'antd';
import type { TableListItem } from '../data';
import { YesOrNo } from '@/components/Enums/Selects';
import { useIntl, FormattedMessage } from 'umi';

export type cloneFormValueType = {
  id: any;
  newLibName: string;
  includeDecoy?: boolean;
};

export type CloneFormProps = {
  onSubmit: (values: cloneFormValueType) => Promise<void>;
  onCancel: () => void;
  cloneModalVisible: boolean;
  values?: TableListItem[];
  form: any;
};
const CloneForm: React.FC<CloneFormProps> = (props) => {
  const intl = useIntl();

  return (
    <ModalForm
      form={props.form}
      title={intl.formatMessage({
        id: 'table.clone',
        defaultMessage: '克隆库',
      })}
      width={400}
      visible={props.cloneModalVisible}
      modalProps={{
        maskClosable: false,
        onCancel: () => {
          props.onCancel();
        },
      }}
      onFinish={props.onSubmit}
      submitter={{
        searchConfig: {
          submitText: <FormattedMessage id="component.submit" />,
        },
        resetButtonProps: {
          style: {
            display: 'none',
          },
        },
        submitButtonProps: {},
        render: (prop) => {
          return [
            <Button type="primary" key="submit" onClick={() => prop.form?.submit?.()}>
              <FormattedMessage id="table.confirm" />
            </Button>,
          ];
        },
      }}
    >
      <ProFormText
        rules={[
          {
            required: true,
            message: <FormattedMessage id="component.libraryNameNull" />,
          },
        ]}
        width="sm"
        name="newLibName"
        label={intl.formatMessage({
          id: 'component.libraryName',
          defaultMessage: '库名称',
        })}
        tooltip={intl.formatMessage({
          id: 'component.libraryNameUni',
          defaultMessage: '库名称必须唯一',
        })}
      />
      <ProFormSelect
        initialValue="false"
        options={YesOrNo}
        width="sm"
        name="includeDecoy"
        label={intl.formatMessage({
          id: 'component.cloneIsDecoy',
          defaultMessage: '克隆是否包含伪肽段',
        })}
      />
    </ModalForm>
  );
};

export default CloneForm;
