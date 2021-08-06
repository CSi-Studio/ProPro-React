/* eslint-disable no-console */
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
  // const xAxisData = [];
  // const data1 = [];
  // const data2 = [];
  // // eslint-disable-next-line no-plusplus
  // for (let i = 0; i < 100; i++) {
  //   xAxisData.push(`类目${i}`);
  //   data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
  //   data2.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5);
  // }

  const option = {
    title: {
      text: 'Peptide_Dist',
    },
    legend: {
      data: ['bar', 'bar2'],
    },
    toolbox: {
      // y: 'bottom',
      feature: {
        magicType: {
          type: ['stack', 'tiled'],
        },
        dataView: {},
        saveAsImage: {
          pixelRatio: 2,
        },
      },
    },
    tooltip: {},
    xAxis: [
      {
        data: props?.currentRow?.statistic?.Peptide_Dist_On_RT_10?.x,
        splitLine: {
          show: false,
        },
      },
      {
        data: props?.currentRow?.statistic?.Peptide_Dist_On_Mz_10?.x,
        splitLine: {
          show: false,
        },
      },
    ],
    yAxis: {},
    series: [
      {
        name: 'bar',
        type: 'bar',
        xAxisIndex: 1,
        data: props?.currentRow?.statistic?.Peptide_Dist_On_RT_10?.y,
        emphasis: {
          focus: 'series',
        },
        animationDelay(idx: number) {
          return idx * 10;
        },
      },
      {
        name: 'bar2',
        type: 'bar',
        data: props?.currentRow?.statistic?.Peptide_Dist_On_Mz_10?.y,
        emphasis: {
          focus: 'series',
        },
        animationDelay(idx: number) {
          return idx * 10 + 100;
        },
      },
    ],
    animationEasing: 'elasticOut',
    animationDelayUpdate(idx: number) {
      return idx * 5;
    },
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
