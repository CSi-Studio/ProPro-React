import React, { useState } from 'react';
import ProForm, {
  ModalForm,
  ProFormSelect,
} from '@ant-design/pro-form';
import { prepare } from '../service';
import { AnalyzeParams } from '../data';

export type AnalyzeFormProps = {
  onSubmit: (values: AnalyzeParams) => Promise<void>;
  onCancel: Record<string, () => void>;
  analyzeModalVisible: boolean;
  values: Partial<any>;
  form: any;
};

const prepareData = await prepare();
const AnalyzeForm: React.FC<AnalyzeFormProps> = (props) => {
  return (
    <ModalForm
      form={props.form}
      title="准备分析"
      width={400}
      visible={props.analyzeModalVisible}
      modalProps={props.onCancel}
      onFinish={props.onSubmit}
    >
      <ProForm.Group>
        <ProFormSelect
          width="sm"
          name="anaLibId"
          label="标准库"
          request={async () => {
            const res: any[] = [];
            prepareData?.data.anaLibs.map((item: { name: any; id: any }) => {
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
          width="sm"
          name="insLibId"
          label="内标库"
          request={async () => {
            const res: any[] = [];
            prepareData?.data.insLibs.map((item: { name: any; id: any }) => {
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
          width="sm"
          name="methodId"
          label="方法包"
          request={async () => {
            const res: any[] = [];
            prepareData?.data.methods.map((item: { name: any; id: any }) => {
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
