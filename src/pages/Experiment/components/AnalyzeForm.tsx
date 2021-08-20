import React, { useState } from 'react';
import ProForm, {
  ModalForm,
  ProFormSelect,
} from '@ant-design/pro-form';
import { AnalyzeParams } from '../data';

export type AnalyzeFormProps = {
  onSubmit: (values: AnalyzeParams) => Promise<void>;
  onCancel: Record<string, () => void>;
  analyzeModalVisible: boolean;
  values: Partial<any>;
  form: any;
};

const AnalyzeForm: React.FC<AnalyzeFormProps> = (props) => {
  const values = props.values;
  return (
    <ModalForm
      form={props.form}
      title={"项目名:"+(values.prepareData?.data.projectName)+",开始分析-"+(values.expNum?values.expNum:0)+"个实验被选中"}
      width={800}
      visible={props.analyzeModalVisible}
      modalProps={props.onCancel}
      onFinish={props.onSubmit}
    >
      <ProForm.Group>
        <ProFormSelect
          initialValue={values.prepareData?.data.anaLibId}
          width="sm"
          name="anaLibId"
          label="标准库"
          request={async () => {
            const res: any[] = [];
            values.prepareData?.data.anaLibs.map((item: { name: any; id: any }) => {
              const temp: Record<any, any> = {};
              temp.label = item.name;
              temp.value = item.id;
              res.push(temp);
              return null;
            });
            return res;
          }}
        />
        <ProFormSelect
          initialValue={values.prepareData?.data.insLibId}
          width="sm"
          name="insLibId"
          label="内标库"
          request={async () => {
            const res: any[] = [];
            values.prepareData?.data.insLibs.map((item: { name: any; id: any }) => {
              const temp: Record<any, any> = {};
              temp.label = item.name;
              temp.value = item.id;
              res.push(temp);
              return null;
            });
            return res;
          }}
        />
         <ProFormSelect
          initialValue={values.prepareData?.data.methodId}
          width="sm"
          name="methodId"
          label="方法包"
          request={async () => {
            const res: any[] = [];
            values?.data.methods.map((item: { name: any; id: any }) => {
              const temp: Record<any, any> = {};
              temp.label = item.name;
              temp.value = item.id;
              res.push(temp);
              return null;
            });
            return res;
          }}
        />
      </ProForm.Group>
    
    </ModalForm>
  );
};

export default AnalyzeForm;
