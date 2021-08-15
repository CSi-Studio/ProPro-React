import React from 'react';
import {
  ProFormText,
  ModalForm,
  ProFormSelect,
  ProFormTextArea,
  ProFormDigit,
} from '@ant-design/pro-form';

export type addFormValueType = {
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
      // width={530}
      visible={props.createModalVisible}
      modalProps={props.onCancel}
      onFinish={props.onSubmit}
    >
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <div>
          <h3>公共参数</h3>
          {/* 公共 */}
          <ProFormText width={170} name="name" label="name" placeholder="name" />
          <ProFormDigit
            width={170}
            name="mzWindow"
            label="mzWindow"
            initialValue="0.03"
            tooltip="MZ窗口，为0.03时表示的是±0.015"
            placeholder="mzWindow"
          />
          <ProFormDigit
            width={170}
            name="rtWindow"
            label="rtWindow"
            initialValue="600"
            tooltip="RT窗口，为0.03时表示的是±300"
            placeholder="rtWindow"
          />
          <ProFormSelect
            initialValue="否"
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
            width={170}
            name="minShapeScore"
            label="minShapeScore"
            placeholder="minShapeScore"
            tooltip="shape的筛选阈值,一般建议在0.6左右"
          />
          <ProFormDigit
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
            width={170}
            name="classifier"
            label="classifier"
            placeholder="classifier"
          ></ProFormText>
          <ProFormDigit
            initialValue="0.01"
            width={170}
            name="fdr"
            label="fdr"
            tooltip="筛选的FDR值,默认值为0.01"
            placeholder="fdr"
          />
        </div>
      </div>
      <ProFormTextArea label="详情描述" name="description" />
    </ModalForm>
  );
};

export default CreateForm;
