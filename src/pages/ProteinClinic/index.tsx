import { Tag, Button, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import ReactECharts from 'echarts-for-react';
import { experimentList } from '../Experiment/service';
import { ProFormGroup, ProFormSelect } from '@ant-design/pro-form';
import { irtList } from '../Irt/service';
import { IrtOption } from '../Irt/charts';

/* echarts 图参数 */
// 每行grid的个数
const gridNumberInRow = 4;
// 横坐标
const xName = `LibTime`;
// 纵坐标
const yName = `RealTime/s`;
// 单张高度（单位px）
const gridHeight = 160;
// 行间间隔高度（单位px）
const gridPaddingHeight = 80;
let Height = 0;

const { TabPane } = Tabs;
const { CheckableTag } = Tag;
// let dataAll = [
//   [
//     [10.0, 8.04],
//     [8.0, 6.95],
//     [13.0, 7.58],
//     [9.0, 8.81],
//     [11.0, 8.33],
//     [14.0, 9.96],
//     [6.0, 7.24],
//     [4.0, 4.26],
//     [12.0, 10.84],
//     [7.0, 4.82],
//     [5.0, 5.68],
//   ],
//   [
//     [10.0, 9.14],
//     [8.0, 8.14],
//     [13.0, 8.74],
//     [9.0, 8.77],
//     [11.0, 9.26],
//     [14.0, 8.1],
//     [6.0, 6.13],
//     [4.0, 3.1],
//     [12.0, 9.13],
//     [7.0, 7.26],
//     [5.0, 4.74],
//   ],
//   [
//     [10.0, 7.46],
//     [8.0, 6.77],
//     [13.0, 12.74],
//     [9.0, 7.11],
//     [11.0, 7.81],
//     [14.0, 8.84],
//     [6.0, 6.08],
//     [4.0, 5.39],
//     [12.0, 8.15],
//     [7.0, 6.42],
//     [5.0, 5.73],
//   ],
//   [
//     [8.0, 6.58],
//     [8.0, 5.76],
//     [8.0, 7.71],
//     [8.0, 8.84],
//     [8.0, 8.47],
//     [8.0, 7.04],
//     [8.0, 5.25],
//     [19.0, 12.5],
//     [8.0, 5.56],
//     [8.0, 7.91],
//     [8.0, 6.89],
//   ],
// ];
// let markLineOpt = {
//   animation: false,
//   label: {
//     formatter: 'y = 0.5 * x + 3',
//     align: 'right',
//   },
//   lineStyle: {
//     type: 'solid',
//   },
//   tooltip: {
//     formatter: 'y = 0.5 * x + 3',
//   },
//   data: [
//     [
//       {
//         coord: [0, 3],
//         symbol: 'none',
//       },
//       {
//         coord: [20, 13],
//         symbol: 'none',
//       },
//     ],
//   ],
// };
// const option = {
//   title: {
//     text: "Anscombe's quartet",
//     left: 'center',
//     top: 0,
//   },
//   grid: [
//     { left: '7%', top: '7%', width: '38%', height: '38%' },
//     { right: '7%', top: '7%', width: '38%', height: '38%' },
//     { left: '7%', bottom: '7%', width: '38%', height: '38%' },
//     { right: '7%', bottom: '7%', width: '38%', height: '38%' },
//   ],
//   tooltip: {
//     formatter: 'Group {a}: ({c})',
//   },
//   xAxis: [
//     { gridIndex: 0, min: 0, max: 20 },
//     { gridIndex: 1, min: 0, max: 20 },
//     { gridIndex: 2, min: 0, max: 20 },
//     { gridIndex: 3, min: 0, max: 20 },
//   ],
//   yAxis: [
//     { gridIndex: 0, min: 0, max: 15 },
//     { gridIndex: 1, min: 0, max: 15 },
//     { gridIndex: 2, min: 0, max: 15 },
//     { gridIndex: 3, min: 0, max: 15 },
//   ],
//   series: [
//     {
//       name: 'I',
//       type: 'scatter',
//       xAxisIndex: 0,
//       yAxisIndex: 0,
//       data: dataAll[0],
//       markLine: markLineOpt,
//     },
//     {
//       name: 'II',
//       type: 'scatter',
//       xAxisIndex: 1,
//       yAxisIndex: 1,
//       data: dataAll[1],
//       markLine: markLineOpt,
//     },
//     {
//       name: 'III',
//       type: 'scatter',
//       xAxisIndex: 2,
//       yAxisIndex: 2,
//       data: dataAll[2],
//       markLine: markLineOpt,
//     },
//     {
//       name: 'IV',
//       type: 'scatter',
//       xAxisIndex: 3,
//       yAxisIndex: 3,
//       data: dataAll[3],
//       markLine: markLineOpt,
//     },
//   ],
// };
const TableList: React.FC = (props: any) => {
  const projectId = props?.location?.query?.projectId;
  const [tags, setTags] = useState<any>([]);
  const [selectedTags, setSelectedTags] = useState<any>([]);
  const [handleOption, setHandleOption] = useState({});
  useEffect(() => {
    const op = async () => {
      const result = await irtList([
        '61234a56a6d49035211f90b4',
        '61234a56a6d49035211f90b5',
        '61234a56a6d49035211f90b6',
        '61234a56a6d49035211f90b7',
        '61234a56a6d49035211f90b8',
        '61234a56a6d49035211f90b9',
      ]);
      const irt = new IrtOption(
        result.data,
        gridNumberInRow,
        xName,
        yName,
        gridHeight,
        gridPaddingHeight,
      );
      const option = irt.getIrtOption();
      Height = Math.ceil(result.data.length / gridNumberInRow) * (gridHeight + gridPaddingHeight);
      setHandleOption(option);
      console.log(option);
    };
    op();
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
    const nextSelectedTags = checked
      ? [...selectedTags, item]
      : selectedTags.filter((t: string) => t !== item);
    setSelectedTags(nextSelectedTags);
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
          <Button
            key="3"
            type="primary"
            onClick={() => {
              console.log(selectedTags);
            }}
          >
            主要按钮
          </Button>,
        ],
      }}
    >
      <ProCard>
        <Tabs size="small" defaultActiveKey="1">
          <TabPane tab="实验列表" key="1">
            <ProCard title="实验列表" direction="column" gutter={[0, 16]}>
              {tags.length > 0 &&
                tags?.map((item: string) => (
                  <CheckableTag
                    key={item}
                    checked={selectedTags?.indexOf(item) > -1}
                    onChange={(checked) => {
                      handleChange(item, checked);
                    }}
                  >
                    {item}
                  </CheckableTag>
                ))}
            </ProCard>
            <ProCard title="蛋白列表" gutter={[0, 16]}>
              <ProFormGroup>
                <ProFormSelect
                  name="select"
                  width={216}
                  label="靶库"
                  options={[
                    { label: '全部', value: 'all' },
                    { label: '未解决', value: 'open' },
                    { label: '已解决', value: 'closed' },
                    { label: '解决中', value: 'processing' },
                  ]}
                  fieldProps={{
                    optionItemRender(item) {
                      return item.label + ' - ' + item.value;
                    },
                  }}
                  placeholder="Please select a country"
                  rules={[{ required: true, message: 'Please select your country!' }]}
                />
                <ProFormSelect
                  name="select"
                  width={216}
                  label="Select"
                  options={[
                    { label: '全部', value: 'all' },
                    { label: '未解决', value: 'open' },
                    { label: '已解决', value: 'closed' },
                    { label: '解决中', value: 'processing' },
                  ]}
                  fieldProps={{
                    optionItemRender(item) {
                      return item.label + ' - ' + item.value;
                    },
                  }}
                  placeholder="Please select a country"
                  rules={[{ required: true, message: 'Please select your country!' }]}
                />
              </ProFormGroup>
            </ProCard>
          </TabPane>
          <TabPane tab="Tab 3" key="3">
            Content of Tab Pane 3
          </TabPane>
        </Tabs>
      </ProCard>
      {/* <ProCard title="实验列表" direction="column" gutter={[0, 16]}>
        {tags.length > 0 &&
          tags?.map((item: string) => (
            <CheckableTag
              key={item}
              checked={selectedTags?.indexOf(item) > -1}
              onChange={(checked) => {
                handleChange(item, checked);
              }}
            >
              {item}
            </CheckableTag>
          ))}
      </ProCard>
      <ProCard title="蛋白列表" gutter={[0, 16]}>
        <ProFormGroup>
          <ProFormSelect
            name="select"
            width={216}
            label="靶库"
            options={[
              { label: '全部', value: 'all' },
              { label: '未解决', value: 'open' },
              { label: '已解决', value: 'closed' },
              { label: '解决中', value: 'processing' },
            ]}
            fieldProps={{
              optionItemRender(item) {
                return item.label + ' - ' + item.value;
              },
            }}
            placeholder="Please select a country"
            rules={[{ required: true, message: 'Please select your country!' }]}
          />
          <ProFormSelect
            name="select"
            width={216}
            label="Select"
            options={[
              { label: '全部', value: 'all' },
              { label: '未解决', value: 'open' },
              { label: '已解决', value: 'closed' },
              { label: '解决中', value: 'processing' },
            ]}
            fieldProps={{
              optionItemRender(item) {
                return item.label + ' - ' + item.value;
              },
            }}
            placeholder="Please select a country"
            rules={[{ required: true, message: 'Please select your country!' }]}
          />
        </ProFormGroup>
      </ProCard> */}
      <ProCard direction="column" gutter={[0, 16]}>
        <ReactECharts
          option={handleOption}
          style={{ width: `100%`, height: Height }}
          lazyUpdate={true}
        />
      </ProCard>
    </PageContainer>
  );
};

export default TableList;
