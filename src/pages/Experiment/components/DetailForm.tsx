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
  const upData:any[]=[]
  const downData: any[]=[]
  const xData:any[]=[]
  props?.currentRow?.windowRanges.map((item: any, index: string)=>{
    upData.push(item?.end-item?.start)
    downData.push(item?.start)
    xData.push(index)
  })
  console.log(upData,downData)
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
      formatter: function (params: any[]) {
        var tar = params[0];
        var tar2 = params[1];
        return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value + '<br/>' +tar2.seriesName + ' : ' + tar2.value;
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
    <Drawer width={500} visible={props.showDetail} onClose={props.onClose} closable={false}>
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
