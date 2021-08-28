import { Tag, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import ReactECharts from 'echarts-for-react';
import { experimentList } from '../Experiment/service';

const { CheckableTag } = Tag;
let dataAll = [
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

let markLineOpt = {
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
const TableList: React.FC = (props: any) => {
  const projectId = props?.location?.query?.projectId;
  const [tags, setTags] = useState<any>([]);
  const [selectedTags, setSelectedTags] = useState<any>([]);
  useEffect(() => {
    /* 实验列表 从Promise中拿值*/
    const tagsData = async () => {
      try {
        const dataSource = await experimentList({ projectId });
        setTags(
          dataSource.data.map((item: any) => {
            return item.name;
          }),
        );
        setSelectedTags(
          tags?.map((item: string) => {
            return item;
          }),
        );
      } catch (err) {
        console.log(err);
      }
    };
    tagsData();
  }, []);

  const handleChange = (item: string, checked: boolean) => {
    console.log(item);
    console.log(checked);
    const nextSelectedTags = checked
      ? [...selectedTags, item]
      : selectedTags.filter((t: string) => t !== item);
    console.log(nextSelectedTags);
    setSelectedTags(nextSelectedTags);
    console.log(selectedTags);
  };
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
    >
      <ProCard title="实验列表" direction="column" gutter={[0, 16]}>
        {tags.length > 0 &&
          tags?.map((item: string) => (
            <CheckableTag
              key={item}
              checked={selectedTags?.indexOf(item) > -1}
              onChange={(checked) => {
                console.log(checked, item);
                handleChange(item, checked);
              }}
            >
              {item}
            </CheckableTag>
          ))}
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
