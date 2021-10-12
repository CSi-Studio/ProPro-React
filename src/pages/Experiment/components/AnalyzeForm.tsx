import React from 'react';
import ProForm, { ModalForm, ProFormSelect, ProFormTextArea } from '@ant-design/pro-form';
import type { AnalyzeParams } from '../data';
import { YesOrNo } from '@/components/Enums/Selects';

export type AnalyzeFormProps = {
  onSubmit: (values: AnalyzeParams) => Promise<void>;
  onCancel: () => void;
  analyzeModalVisible: boolean;
  values: Partial<any>;
  form: any;
};

const AnalyzeForm: React.FC<AnalyzeFormProps> = (props) => {
  const {values} = props;
  return (
    <ModalForm
      form={props.form}
      title={
        `项目名:${ 
        values.prepareData?.projectName 
        },开始分析-${ 
        values.expNum ? values.expNum : 0 
        }个实验被选中`
      }
      width={800}
      visible={props.analyzeModalVisible}
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
          initialValue={values.prepareData?.anaLibId}
          width="sm"
          name="anaLibId"
          label="标准库"
          request={async () => {
            const res: any[] = [];
            values.prepareData?.anaLibs.map((item: { name: any; id: any }) => {
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
          initialValue={values.prepareData?.insLibId}
          width="sm"
          name="insLibId"
          label="内标库"
          request={async () => {
            const res: any[] = [];
            values.prepareData?.insLibs.map((item: { name: any; id: any }) => {
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
          initialValue={values.prepareData?.methodId}
          width="sm"
          name="methodId"
          label="方法包"
          request={async () => {
            const res: any[] = [];
            values?.prepareData?.methods.map((item: { name: any; id: any }) => {
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
      <ProForm.Group>
        <ProFormSelect
          initialValue={'false'}
          width="sm"
          name="onlyIrt"
          label="仅执行Irt"
          options={YesOrNo}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormTextArea
          width="lg"
          name="note"
          label="备注"
        />
      </ProForm.Group>
    </ModalForm>
  );
};

export default AnalyzeForm;
