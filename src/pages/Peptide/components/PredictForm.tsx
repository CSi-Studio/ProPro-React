import React from 'react';
import ProForm, { ProFormSelect, ModalForm, ProFormDigit } from '@ant-design/pro-form';
import { SpModelType, YesOrNo } from '@/components/Enums/Selects';

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
  return (
    <ModalForm
      form={props.form}
      title="预测肽段碎片"
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
              message: '碰撞方式不能为空',
            },
          ]}
          options={SpModelType}
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
          options={YesOrNo}
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
