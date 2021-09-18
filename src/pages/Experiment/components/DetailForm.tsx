import React, { useState } from 'react';
import { Drawer } from 'antd';
import type { TableListItem } from '@/pages/Project/data';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import ReactECharts from 'echarts-for-react';

export type UpdateFormProps = {
  showDetail: any;
  currentRow: any;
  columns: any;
  onClose: () => void;
  // values: Partial<API.RuleListItem>;
};

const DetailForm: React.FC<UpdateFormProps> = (props) => {
  const upData: any[]=[]
  const downData: any[]=[]
  const xData: any[]=[]
  const features: any[]=[]
  props?.currentRow?.windowRanges.map((item: any, index: string)=>{
    upData.push(item?.end-item?.start)
    downData.push(item?.start)
    xData.push(index)
    features.push(item?.features)
  })
  const option = {
    title: {
      text: '窗口表',
      subtext: 'Swath Chart'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
      },
      formatter (params: any[]) {
        const tar = params[0];
        const tar2 = params[1];
        return `${tar.name  }<br/>` + `start` + ` : ${  tar.value  }<br/>` +`end` + ` : ${  tar.value+tar2.value  }<br/>`+` owid`+`:${tar2.value}`;
      },
    },
    // grid: {
    //   left: '3%',
    //   right: '4%',
    //   bottom: '3%',
    //   containLabel: true,
    // },
    xAxis: {
      type: 'category',
      splitLine: { show: false },
      data:xData
    },
    yAxis: {
      type: 'value',
      min (value: { min: number; }) {
        return value.min;
    }
    },
    series: [
      {
        name: 'swath最小值',
        type: 'bar',
        stack: '总量',
        itemStyle: {
          barBorderColor: 'rgba(0,0,0,0)',
          color: 'rgba(0,0,0,0)',
        },
        emphasis: {
          itemStyle: {
            barBorderColor: 'rgba(0,0,0,0)',
            color: 'rgba(0,0,0,0)',
          },
        },
        data: downData
      },
      {
        name: 'swath最大值',
        type: 'bar',
        stack: '总量',
        label: {
          show: false,
          position: 'inside',
        },
        data: upData,
      },  
    ],
  };

  return (
    <Drawer width={700} visible={props.showDetail} onClose={props.onClose} closable={false}>
      {props.currentRow?.name && (
        <ProDescriptions<TableListItem>
          column={1}
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
      <ReactECharts option={option} style={{ height: 800 }} />
    </Drawer>
     
  );
};

export default DetailForm;
