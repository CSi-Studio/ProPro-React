import React from 'react';
import { Drawer } from 'antd';
import type { DictListItem } from '@/pages/Dict/data';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
// import ReactECharts from 'echarts-for-react';
import ProDescriptions from '@ant-design/pro-descriptions';
import { dictList } from '../service';

export type UpdateFormProps = {
  showDetail: any;
  currentRow: any;
  columns: any;
  onClose: () => void;
  // values: Partial<API.RuleListItem>;
};

const DetailForm: React.FC<UpdateFormProps> = (props) => {
  return (
    <Drawer width={800} visible={props.showDetail} onClose={props.onClose} closable={false}>
      {props.currentRow?.name && (
        <ProDescriptions<DictListItem>
          column={2}
          title={props.currentRow?.name}
          request={dictList}
          params={{
            id: props.currentRow?.name,
          }}
          columns={props.columns as ProDescriptionsItemProps<DictListItem>[]}
        />
      )}
    </Drawer>
  );
};

export default DetailForm;
