import React from 'react';
import ProForm, { ProFormText, ProFormTextArea, DrawerForm } from '@ant-design/pro-form';
import { DatePicker, Slider, TimePicker } from 'antd';
import moment from 'moment';

export type FormValueType = {
  name?: string;
  type?: string;
  file?: string;
  description?: string;
} & Partial<API.RuleListItem>;

export type DetailFormProps = {
  onSubmit: (values: FormValueType) => Promise<void>;
  onCancel: Record<string, () => void>;
  detailModalVisible: boolean;
  values: Partial<API.RuleListItem>;
};
const dateFormat = 'YYYY/MM/DD';

const DetailForm: React.FC<DetailFormProps> = (props) => {
  return (
    <DrawerForm<{
      name: string;
      company: string;
    }>
      title="标准库详情页"
      visible={props.detailModalVisible}
      drawerProps={props.onCancel}
      onFinish={props.onSubmit}
    >
      <ProForm.Group>
        <ProFormText name="id" width="md" label="标准库ID" />
        <ProFormText width="md" name="name" label="标准库名称" tooltip="库名称必须唯一" />
        <ProFormText name="type" width="md" label="库类型" />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText width="md" name="contract" label="蛋白质数目" />
        <ProFormText width="md" name="contract" label="Unique蛋白质数目" />
        <ProFormText width="md" name="contract" label="Library去除蛋白数目" />
        <ProFormText width="md" name="contract" label="肽段数目" />
        <ProFormText width="md" name="contract" label="Unique肽段数目" />
        <ProFormText width="md" name="contract" label="Library去除真肽段数目" />
        <ProFormText width="md" name="contract" label="Fasta去除蛋白数目" />
        <ProFormText width="md" name="contract" label="Fasta去除真肽段数目" />
      </ProForm.Group>
      {/* <Slider range={{ draggableTrack: true }} defaultValue={[20, 50]} /> */}
      <ProFormTextArea label="详情描述" name="description" />
      <ProFormText width="md" name="contract" label="创建人" />
      {/* <div>创建时间</div>
      <DatePicker defaultValue={moment('2015-01-01', dateFormat)} format={dateFormat} />
      <TimePicker defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} />
      <div>最后修改时间</div>
      <DatePicker defaultValue={moment('2015-01-01', dateFormat)} format={dateFormat} />
      <TimePicker defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} /> */}
    </DrawerForm>
  );
};

export default DetailForm;
