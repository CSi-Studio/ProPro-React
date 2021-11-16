import React from 'react';
import ProForm, { ModalForm, ProFormSelect, ProFormTextArea } from '@ant-design/pro-form';
import type { AnalyzeParams } from '../data';
import { YesOrNo } from '@/components/Enums/Selects';
import { useIntl } from 'umi';

export type AnalyzeFormProps = {
  onSubmit: (values: AnalyzeParams) => Promise<void>;
  onCancel: () => void;
  analyzeModalVisible: boolean;
  values: Partial<any>;
  form: any;
};

const AnalyzeForm: React.FC<AnalyzeFormProps> = (props) => {
  const intl = useIntl();

  const { values } = props;
  return (
    <ModalForm
      form={props.form}
      title={`${intl.formatMessage({
        id: 'table.project.name',
        defaultMessage: '项目名称',
      })}：${values.prepareData?.projectName} ${intl.formatMessage({
        id: 'table.run.number',
        defaultMessage: 'Run数',
      })}：${values.runNum ? values.runNum : 0}`}
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
          label={intl.formatMessage({
            id: 'table.standardLibrary',
            defaultMessage: '标准库',
          })}
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
          label={intl.formatMessage({
            id: 'table.innerLibrary',
            defaultMessage: '内标库',
          })}
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
          label={intl.formatMessage({
            id: 'table.methodPackage',
            defaultMessage: '方法包',
          })}
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
          label={intl.formatMessage({
            id: 'table.performIrtOnly',
            defaultMessage: '仅执行Irt',
          })}
          options={YesOrNo}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormTextArea
          width="lg"
          name="note"
          label={intl.formatMessage({
            id: 'table.remark',
            defaultMessage: '备注',
          })}
        />
      </ProForm.Group>
    </ModalForm>
  );
};

export default AnalyzeForm;
