import React from 'react';
import ProForm, { ProFormSelect, ModalForm, ProFormDigit } from '@ant-design/pro-form';

export type predictFormValueType = {
  spModel: string;
  isotope: boolean;
  limit: number;
  peptideId: string;
};

export type PredictFormProps = {
  onSubmit: (values: predictFormValueType) => Promise<void>;
  onCancel: Record<string, () => void>;
  predictModalVisible: boolean;
  values: any;
  form: any;
};

const PredictForm: React.FC<PredictFormProps> = (props) => {
  return (
    <ModalForm
      form={props.form}
      title="预测肽段碎片"
      width={800}
      visible={props.predictModalVisible}
      modalProps={props.onCancel}
      onFinish={props.onSubmit}
    >
      <ProForm.Group>
        <ProFormSelect
          initialValue="CID"
          rules={[
            {
              required: true,
              message: '碰撞方式不能为空',
            },
          ]}
          options={[
            {
              value: 'HCD',
              label: 'HCD',
            },
            {
              value: 'CID',
              label: 'CID',
            },
          ]}
          width="sm"
          name="spModel"
          label="碰撞方式"
        />
        <ProFormSelect
          initialValue="false"
          rules={[
            {
              required: true,
              message: '是否考虑同位素',
            },
          ]}
          options={[
            {
              value: 'true',
              label: 'true',
            },
            {
              value: 'false',
              label: 'false',
            },
          ]}
          width="sm"
          name="isotope"
          label="是否考虑同位素"
        />
        <ProFormDigit
        initialValue={10}
        width="sm"
        name="limit"
        label="最大预测片段数"
        rules={[
          {
            required: true,
            message: '最大片段数不能为空',
          },
        ]}
        placeholder="请输入最大片段数"
      ></ProFormDigit>
      </ProForm.Group>
    </ModalForm>
  );
};

export default PredictForm;
