import React from 'react';
import ProForm, { ProFormSelect, ModalForm, ProFormDigit } from '@ant-design/pro-form';
import { SpModelType, YesOrNo } from '@/components/Enums/Selects';
import { useIntl, FormattedMessage } from 'umi';

export type predictFormValueType = {
  spModel: string;
  isotope: boolean;
  limit: number;
  peptideId: string;
};

export type PredictFormProps = {
  onSubmit: (values: predictFormValueType) => Promise<void>;
  onCancel: () => void;
  predictModalVisible: boolean;
  values: any;
  form: any;
};

const PredictForm: React.FC<PredictFormProps> = (props) => {
  const intl = useIntl();

  return (
    <ModalForm
      form={props.form}
      title={intl.formatMessage({
        id: 'table.predPepFra',
        defaultMessage: '预测肽段碎片',
      })}
      width={800}
      visible={props.predictModalVisible}
      modalProps={{
        maskClosable: false,
        onCancel: () => {
          props.onCancel();
        },
      }}
      onFinish={props.onSubmit}
    >
      <ProForm.Group>
        <ProFormSelect
          initialValue="CID"
          rules={[
            {
              required: true,
              message: <FormattedMessage id="component.nullSpModel" />,
            },
          ]}
          options={SpModelType}
          width="sm"
          name="spModel"
          label={intl.formatMessage({
            id: 'component.spModel',
            defaultMessage: '碰撞方式',
          })}
        />
        <ProFormSelect
          initialValue="false"
          rules={[
            {
              required: true,
              message: <FormattedMessage id="component.isotope" />,
            },
          ]}
          options={YesOrNo}
          width="sm"
          name="isotope"
          label={intl.formatMessage({
            id: 'component.isotope',
            defaultMessage: '是否考虑同位素',
          })}
        />
        <ProFormDigit
          initialValue={10}
          width="sm"
          name="limit"
          label={intl.formatMessage({
            id: 'component.maxPredFra',
            defaultMessage: '最大预测片段数',
          })}
          rules={[
            {
              required: true,
              message: <FormattedMessage id="component.nullMaxPredFra" />,
            },
          ]}
        />
      </ProForm.Group>
    </ModalForm>
  );
};

export default PredictForm;
