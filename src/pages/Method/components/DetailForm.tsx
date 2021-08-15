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
  const xAxisData1 = props?.currentRow?.statistic?.Peptide_Dist_On_Mz_5?.x;
  const xAxisData2 = props?.currentRow?.statistic?.Peptide_Dist_On_RT_5?.x;
  const data1 = props?.currentRow?.statistic?.Peptide_Dist_On_Mz_5?.y;
  const data2 = props?.currentRow?.statistic?.Peptide_Dist_On_RT_5?.y;

  const option = {
    legend: {},
    tooltip: {},
    dataset: {
      source: [],
    },

    title: {
      text: 'Peptide_Dist_On_Mz_5',
      subtext: 'Peptide_Dist_On_Mz_5',
    },
    xAxis: {
      type: 'category',
      data: xAxisData1,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        type: 'bar',
        data: data1,
      },
    ],
  };
  const option1 = {
    legend: {},
    tooltip: {},
    dataset: {
      source: [],
    },

    title: {
      text: 'Peptide_Dist_On_RT_5',
      subtext: 'Peptide_Dist_On_RT_5',
    },
    xAxis: {
      type: 'category',
      data: xAxisData2,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        type: 'bar',
        data: data2,
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
      <ReactECharts option={option} style={{ height: 400 }} />
      <ReactECharts option={option1} style={{ height: 400 }} />
    </Drawer>
  );
};

export default DetailForm;
