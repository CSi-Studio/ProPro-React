import React from 'react';
import { ProFormTextArea, DrawerForm } from '@ant-design/pro-form';
import { Input } from 'antd';

export type FormValueType = {
  name?: string;
  type?: string;
  file?: string;
  description?: string;
} & Partial<API.RuleListItem>;

export type DetailFormProps = {
  dataSource: [];
  onSubmit: (values: FormValueType) => Promise<void>;
  onCancel: Record<string, () => void>;
  detailModalVisible: boolean;
  values: Partial<API.RuleListItem>;
};

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
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          <span>标准库ID</span>
          <Input placeholder="Borderless" bordered={false} />
        </div>
        <div style={{ flex: 1 }}>
          <span>库类型</span>
          <Input placeholder="Borderless" bordered={false} />
        </div>
      </div>
      <div style={{ display: 'flex', flex: 1 }}>
        <div style={{ flex: 1 }}>
          <span>蛋白质数目</span>
          <Input placeholder="Borderless" bordered={false} />
        </div>
        <div style={{ flex: 1 }}>
          <span>肽段数目</span>
          <Input placeholder="Borderless" bordered={false} />
        </div>
      </div>
      <div style={{ display: 'flex', flex: 1 }}>
        <div style={{ flex: 1 }}>
          <span>碎片数目</span>
          <Input placeholder="Borderless" bordered={false} />
        </div>
        <div style={{ flex: 1 }}>
          <span>10%的重复率</span>
          <Input placeholder="Borderless" bordered={false} />
        </div>
      </div>
      <div style={{ display: 'flex', flex: 1 }}>
        <div style={{ flex: 1 }}>
          <span>5%的重复率</span>
          <Input placeholder="Borderless" bordered={false} />
        </div>
        <div style={{ flex: 1 }}>
          <span>有机生物</span>
          <Input placeholder="Borderless" bordered={false} />
        </div>
      </div>
      <ProFormTextArea bordered={false} label="详情描述" name="description" />

      {/* <Slider range={{ draggableTrack: true }} defaultValue={[20, 50]} /> */}
      {/* <ProFormTextArea bordered={false} label="详情描述" name="description" />
      <ProFormText bordered={false} width="md" name="contract" label="创建人" />
      <ProFormDatePicker name="date" label="日期" />
      <ProFormTimePicker name="time" label="时间" /> */}
    </DrawerForm>
  );
};

export default DetailForm;
