import { Tag, Button } from 'antd';
import React, { useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import ReactECharts from 'echarts-for-react';

var dataAll = [
  [
    [10.0, 8.04],
    [8.0, 6.95],
    [13.0, 7.58],
    [9.0, 8.81],
    [11.0, 8.33],
    [14.0, 9.96],
    [6.0, 7.24],
    [4.0, 4.26],
    [12.0, 10.84],
    [7.0, 4.82],
    [5.0, 5.68],
  ],
  [
    [10.0, 9.14],
    [8.0, 8.14],
    [13.0, 8.74],
    [9.0, 8.77],
    [11.0, 9.26],
    [14.0, 8.1],
    [6.0, 6.13],
    [4.0, 3.1],
    [12.0, 9.13],
    [7.0, 7.26],
    [5.0, 4.74],
  ],
  [
    [10.0, 7.46],
    [8.0, 6.77],
    [13.0, 12.74],
    [9.0, 7.11],
    [11.0, 7.81],
    [14.0, 8.84],
    [6.0, 6.08],
    [4.0, 5.39],
    [12.0, 8.15],
    [7.0, 6.42],
    [5.0, 5.73],
  ],
  [
    [8.0, 6.58],
    [8.0, 5.76],
    [8.0, 7.71],
    [8.0, 8.84],
    [8.0, 8.47],
    [8.0, 7.04],
    [8.0, 5.25],
    [19.0, 12.5],
    [8.0, 5.56],
    [8.0, 7.91],
    [8.0, 6.89],
  ],
];

var markLineOpt = {
  animation: false,
  label: {
    formatter: 'y = 0.5 * x + 3',
    align: 'right',
  },
  lineStyle: {
    type: 'solid',
  },
  tooltip: {
    formatter: 'y = 0.5 * x + 3',
  },
  data: [
    [
      {
        coord: [0, 3],
        symbol: 'none',
      },
      {
        coord: [20, 13],
        symbol: 'none',
      },
    ],
  ],
};
const option = {
  title: {
    text: "Anscombe's quartet",
    left: 'center',
    top: 0,
  },
  grid: [
    { left: '7%', top: '7%', width: '38%', height: '38%' },
    { right: '7%', top: '7%', width: '38%', height: '38%' },
    { left: '7%', bottom: '7%', width: '38%', height: '38%' },
    { right: '7%', bottom: '7%', width: '38%', height: '38%' },
  ],
  tooltip: {
    formatter: 'Group {a}: ({c})',
  },
  xAxis: [
    { gridIndex: 0, min: 0, max: 20 },
    { gridIndex: 1, min: 0, max: 20 },
    { gridIndex: 2, min: 0, max: 20 },
    { gridIndex: 3, min: 0, max: 20 },
  ],
  yAxis: [
    { gridIndex: 0, min: 0, max: 15 },
    { gridIndex: 1, min: 0, max: 15 },
    { gridIndex: 2, min: 0, max: 15 },
    { gridIndex: 3, min: 0, max: 15 },
  ],
  series: [
    {
      name: 'I',
      type: 'scatter',
      xAxisIndex: 0,
      yAxisIndex: 0,
      data: dataAll[0],
      markLine: markLineOpt,
    },
    {
      name: 'II',
      type: 'scatter',
      xAxisIndex: 1,
      yAxisIndex: 1,
      data: dataAll[1],
      markLine: markLineOpt,
    },
    {
      name: 'III',
      type: 'scatter',
      xAxisIndex: 2,
      yAxisIndex: 2,
      data: dataAll[2],
      markLine: markLineOpt,
    },
    {
      name: 'IV',
      type: 'scatter',
      xAxisIndex: 3,
      yAxisIndex: 3,
      data: dataAll[3],
      markLine: markLineOpt,
    },
  ],
};
const TableList: React.FC = () => {
  const [tagState, setTagState] = useState<any>();
  return (
    <PageContainer
      header={{
        onBack: () => {
          window.history.back();
        },
        title: '蛋白诊所',
        ghost: true,
        tags: [<Tag color="blue">开发中...</Tag>],
        subTitle: '这是一个蛋白诊所，分析处理各种蛋白',
        // breadcrumb: {
        //   routes: [
        //     {
        //       path: '',
        //       breadcrumbName: '一级页面',
        //     },
        //     {
        //       path: '',
        //       breadcrumbName: '二级页面',
        //     },
        //     {
        //       path: '',
        //       breadcrumbName: '当前页面',
        //     },
        //   ],
        // },
        extra: [
          <Button key="3" type="primary">
            主要按钮
          </Button>,
        ],
      }}
      tabList={[
        {
          tab: '基本信息',
          key: 'base',
          closable: false,
        },
        {
          tab: '详细信息',
          key: 'info',
        },
      ]}
      // tabProps={{
      //   type: 'editable-card',
      //   hideAdd: true,
      //   onEdit: (e, action) => console.log(e, action),
      // }}
      // footer={[
      //   <Button key="3">重置</Button>,
      //   <Button key="2" type="primary">
      //     提交
      //   </Button>,
      // ]}
    >
      <ProCard
        title="操作栏"
        // style={{ backgroundColor: 'teal', height: 200 }}
        direction="column"
        // ghost
        gutter={[0, 16]}
      >
        <a>
          <Tag
            onClick={() => {
              setTagState(!tagState);
            }}
            color={tagState ? 'green' : 'blue'}
          >
            sdasdasdas
          </Tag>
        </a>
        <ProCard gutter={16} ghost></ProCard>
      </ProCard>
      <ProCard
        title="参数"
        // style={{ backgroundColor: 'teal', height: 200 }}
        direction="column"
        // ghost
        gutter={[0, 16]}
      >
        <ProCard gutter={16} ghost />
      </ProCard>
      <ProCard
        style={{ backgroundColor: 'lightsalmon', height: 200 }}
        direction="column"
        ghost
        gutter={[0, 16]}
      ></ProCard>
      <ProCard direction="column" gutter={[0, 16]}>
        <ReactECharts
          option={option}
          style={{ width: '100%', height: '1000px' }}
          lazyUpdate={true}
        />
      </ProCard>
    </PageContainer>
  );
};

export default TableList;
