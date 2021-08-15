import React from 'react';
import {
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ModalForm,
  ProFormDigit,
} from '@ant-design/pro-form';

export type updateFormValueType = {
  name: string;
  mzWindow: number;
  rtWindow: number;
  adaptiveMzWindow: boolean;
  minMzWindow: number;
  minShapeScore: number;
  minShapeWeightScore: number;
  classifier: string;
  fdr: number;
  description: string;
  id: string;
};

export type UpdateFormProps = {
  onSubmit: (values: updateFormValueType) => Promise<void>;
  onCancel: Record<string, () => void>;
  updateModalVisible: boolean;
  values: any;
  form: any;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  return (
    <ModalForm
      form={props.form}
      title="更新方法库"
      visible={props.updateModalVisible}
      modalProps={props.onCancel}
      onFinish={props.onSubmit}
    >
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <div>
          <h3>公共参数</h3>
          {/* 公共 */}
          <ProFormText
            disabled
            initialValue={props.values.name}
            width={170}
            name="name"
            label="name"
            placeholder="name"
          />
          <ProFormDigit
            initialValue={props.values.mzWindow}
            width={170}
            name="mzWindow"
            label="mzWindow"
            tooltip="MZ窗口，为0.03时表示的是±0.015"
            placeholder="mzWindow"
          />
          <ProFormDigit
            width={170}
            name="rtWindow"
            label="rtWindow"
            initialValue={props.values.rtWindow}
            tooltip="RT窗口，为0.03时表示的是±300"
            placeholder="rtWindow"
          />
          <ProFormSelect
            initialValue={props.values.adaptiveMzWindow}
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
            width={170}
            tooltip="是否使用自适应mz窗口,自适应mz算"
            name="adaptiveMzWindow"
            label="adaptiveMzWindow"
          />
        </div>
        <div>
          <h3>IRT参数</h3>
          {/* IRT */}
          <ProFormDigit
            initialValue={props.values.minMzWindow}
            width={170}
            name="minMzWindow"
            label="minMzWindow"
            placeholder="minMzWindow"
            tooltip="最小mz偏差, Da, 若按照mzWindow计算得到的mz偏差小于最小mz偏差, mz偏差重置为最小mz偏差"
          />
        </div>
        <div>
          <h3>打分参数</h3>
          {/* 打分参数 */}
          <ProFormDigit
            initialValue={props.values.minShapeScore}
            width={170}
            name="minShapeScore"
            label="minShapeScore"
            placeholder="minShapeScore"
            tooltip="shape的筛选阈值,一般建议在0.6左右"
          />
          <ProFormDigit
            initialValue={props.values.minShapeWeightScore}
            width={170}
            name="minShapeWeightScore"
            label="minShapeWeightScore"
            placeholder="minShapeWeightScore"
            tooltip="shape的筛选阈值,一般建议在0.8左右"
          />
        </div>
        <div>
          <h3>分类参数</h3>
          {/* 分类参数 */}
          <ProFormText
            initialValue={props.values.classifier}
            width={170}
            name="classifier"
            label="classifier"
            placeholder="classifier"
          ></ProFormText>
          <ProFormDigit
            initialValue={props.values.fdr}
            width={170}
            name="fdr"
            label="fdr"
            tooltip="筛选的FDR值,默认值为0.01"
            placeholder="fdr"
          />
        </div>
      </div>
      <ProFormTextArea
        initialValue={props.values.description}
        label="详情描述"
        name="description"
      />
    </ModalForm>
  );
};

export default UpdateForm;
