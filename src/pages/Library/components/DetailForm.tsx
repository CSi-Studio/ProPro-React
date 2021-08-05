import React from 'react';
import { Drawer } from 'antd';
import type { TableListItem } from '@/pages/Project/data';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ReactECharts from 'echarts-for-react';
import ProDescriptions from '@ant-design/pro-descriptions';

export type UpdateFormProps = {
  showDetail: any;
  currentRow: any;
  columns: any;
  onClose: () => void;
  // values: Partial<API.RuleListItem>;
};

const DetailForm: React.FC<UpdateFormProps> = (props) => {
  const option = {
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: props?.currentRow?.statistic?.Peptide_Dist_On_Mz_10?.x,
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: [
      {
        type: 'line',
        data: props?.currentRow?.statistic?.Peptide_Dist_On_Mz_10?.y,
      },
    ],
  };
  const option1 = {
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: props?.currentRow?.statistic?.Peptide_Dist_On_RT_10?.x,
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: [
      {
        type: 'line',
        data: props?.currentRow?.statistic?.Peptide_Dist_On_RT_10?.y,
      },
    ],
  };
  return (
    <Drawer width={800} visible={props.showDetail} onClose={props.onClose} closable={false}>
      {props.currentRow?.name && (
        <ProDescriptions<TableListItem>
          column={2}
          title={props.currentRow?.name}
          request={async () => ({
            data: props.currentRow || {},
          })}
          params={{
            id: props.currentRow?.name,
          }}
          columns={props.columns as ProDescriptionsItemProps<TableListItem>[]}
        />
      )}
      <div>
        <strong>Peptide_Dist_On_Mz_10:</strong>
      </div>
      <ReactECharts option={option} style={{ height: 400 }} />
      <div>
        <strong>Peptide_Dist_On_RT_10:</strong>
      </div>
      <ReactECharts option={option1} style={{ height: 400 }} />
    </Drawer>
  );
};

export default DetailForm;
