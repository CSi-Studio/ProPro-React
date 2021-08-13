import React from 'react';
import ProForm, {
  ProFormText,
  ModalForm,
  ProFormSelect,
  ProFormTextArea,
  ProFormUploadDragger,
  ProFormDigit,
} from '@ant-design/pro-form';
import { Button, Input, message, Space, Tag } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Icon } from '@iconify/react';

export type addFormValueType = {
  adaptiveMzWindow?: boolean;
  fdr?: number;
  minMzWindow?: number;
  minShapeScore?: number;
  minShapeWeightScore?: number;
  mzWindow?: number;
  name?: string;
  rtWindow?: number;
  'si.intercept'?: number;
  'si.slope'?: number;
  description?: number;
};

export type CreateFormProps = {
  onSubmit: (values: addFormValueType) => Promise<void>;
  onCancel: Record<string, () => void>;
  createModalVisible: boolean;
  values: Partial<any>;
  form: any;
};

const CreateForm: React.FC<CreateFormProps> = (props) => {
  return (
    <ModalForm
      form={props.form}
      title="创建一个库"
      width={530}
      visible={props.createModalVisible}
      modalProps={props.onCancel}
      onFinish={props.onSubmit}
    >
      <ProForm.Group>
        {/* 公共 */}
        <ProFormDigit
          width="sm"
          name="mzWindow"
          label="mzWindow"
          initialValue="0.03"
          tooltip="MZ窗口，为0.03时表示的是±0.015"
          placeholder="mzWindow"
        />
        <ProFormDigit
          width="sm"
          name="rtWindow"
          label="rtWindow"
          initialValue="600"
          tooltip="RT窗口，为0.03时表示的是±300"
          placeholder="rtWindow"
        />
        <ProFormSelect
          initialValue="false"
          options={[
            {
              value: 'true',
              label: '是',
            },
            {
              value: 'false',
              label: '否',
            },
          ]}
          width="sm"
          tooltip="是否使用自适应mz窗口,自适应mz算"
          name="adaptiveMzWindow"
          label="adaptiveMzWindow"
        />
      </ProForm.Group>
      <ProForm.Group>
        {/* IRT */}
        <ProFormDigit
          width="sm"
          name="si.slope"
          label="si.slope"
          placeholder="si.slope"
          tooltip="在做RT校准时使用的斜率截距,如果为空则表示使用irt计算实时获取"
        />
        <ProFormDigit
          width="sm"
          name="minMzWindow"
          label="minMzWindow"
          placeholder="minMzWindow"
          tooltip="最小mz偏差, Da, 若按照mzWindow计算得到的mz偏差小于最小mz偏差, mz偏差重置为最小mz偏差"
        />
      </ProForm.Group>
      <ProForm.Group>
        {/* 打分参数 */}
        <ProFormDigit
          width="sm"
          name="minShapeScore"
          label="minShapeScore"
          placeholder="minShapeScore"
          tooltip="shape的筛选阈值,一般建议在0.6左右"
        />
        <ProFormDigit
          width="sm"
          name="minShapeWeightScore"
          label="minShapeWeightScore"
          placeholder="minShapeWeightScore"
          tooltip="shape的筛选阈值,一般建议在0.8左右"
        />
      </ProForm.Group>
      <ProForm.Group>
        {/* 分类参数 */}
        <ProFormText name="classifier" label="classifier" placeholder="classifier"></ProFormText>
        <ProFormDigit
          initialValue="0.01"
          width="sm"
          name="fdr"
          label="fdr"
          tooltip="筛选的FDR值,默认值为0.01"
          placeholder="fdr"
        />
      </ProForm.Group>

      <ProFormText width="sm" name="name" label="name" placeholder="name" />

      <ProFormDigit
        width="sm"
        name="si.intercept"
        label="si.intercept"
        placeholder="si.intercept"
      />

      <ProFormTextArea label="详情描述" name="description" />
    </ModalForm>
  );
};

export default CreateForm;
