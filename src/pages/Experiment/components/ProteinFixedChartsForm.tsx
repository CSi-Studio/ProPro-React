import { Button, Input, Modal, Space } from 'antd';
import ReactECharts from 'echarts-for-react';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

export type ChartsFormProps = {
  showCharts: any;
  chartsData: any;
  onCancel: () => void;
  proteinName: string;
};
const ProteinFixedChartsForm: React.FC<ChartsFormProps> = (props) => {
  const [options, setOptions] = useState<any>();
  const [rangeNumber, setRangeNumber] = useState<any>(10);
  const [inputNumber, setInputNumber] = useState<any>(10);
  const [handleOption, setHandleOption] = useState({});
  const [disturbNumber, setDisturbNumber] = useState<any>(10);
  const [disturbInputNumber, setDisturbInputNumber] = useState<any>(10);
  const [intensityInputNumber, setIntensityInputNumber] = useState<any>(0.5);
  const [intensityNumber, setIntensityNumber] = useState<any>(0.5);
  const [keyNumber, setKeyNumber] = useState<any>('new date');
  const data = props?.chartsData;
  data?.nodes?.forEach(function (node: any) {
    (node.label = {
      show: node.symbolSize > 22,
    }),
      (node.tooltip = {
        formatter: 'peptide:{b} <br /> mz&rt:{c0}',
      }),
      (node.itemStyle = {}),
      data?.count?.forEach(function (link: any) {
        if (link.name === node.id && link.number >= disturbNumber) {
          (node.itemStyle = {
            color: '#FFF',
          }),
            (node.label = {
              show: true,
              formatter: link.number + '',
              position: 'inside',
              color: '#000',
              fontWeight: 'bolder',
            });
        }
      });
  });
  data?.links?.forEach((link: any, index: number) => {
    link.lineStyle = null;
    if (
      link.value < rangeNumber &&
      link.target.indexOf('-') !== -1 &&
      link.source.indexOf('-') != -1
    ) {
      data?.intensity?.forEach((intensity: any, index2: number) => {
        if (intensity.source == link.source && intensity.target == link.target) {
          if (intensity.value <= intensityNumber) {
            link.lineStyle = {
              color: '#E20618',
              width: 1.5,
            };
          } else {
            link.lineStyle = {
              color: '#E2061857',
            };
          }
        }
      });
    }
  });
  useEffect(() => {
    const getOption = () => {
      const option = {
        title: {
          text: props.proteinName,
          subtext: 'Default layout',
          top: 'bottom',
          left: 'right',
        },
        tooltip: {},
        legend: [
          {
            selectedMode: 'multiple',
            data: data?.categories?.map(function (a: any) {
              return a.name;
            }),
          },
        ],
        animationDuration: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
          {
            draggable: true,
            name: props?.proteinName,
            type: 'graph',
            layout: 'force',
            coordinateSystem: false,
            data: data?.nodes,
            edges: data?.links,
            categories: data?.categories,
            roam: true,
            legendHoverLink: true,
            force: {
              edgeLength: [100, 0],
              initLayout: 'circular',
              repulsion: 100,
            },
            label: {
              position: 'right',
              formatter: '{b}',
            },
            lineStyle: {
              color: 'source',
              curveness: 0.3,
            },
            emphasis: {
              focus: 'adjacency',
              lineStyle: {
                width: 10,
              },
            },
          },
        ],
      };
      return option;
    };
    setOptions(getOption());
    console.log(options);
  }, [props]);

  return (
    <Modal
      visible={props.showCharts}
      width={1200}
      maskClosable={false}
      afterClose={() => {
        setDisturbNumber(10);
        setRangeNumber(10);
        setIntensityNumber(0.5);
        setDisturbInputNumber(10);
        setInputNumber(10);
        setIntensityInputNumber(0.5);
        setOptions({});
        setKeyNumber(new Date());
      }}
      onCancel={props.onCancel}
    >
      <Space direction="horizontal">
        <Input
          style={{ width: '120px' }}
          defaultValue="10"
          onChange={(e) => setInputNumber(e.target.value)}
          addonBefore="rt范围"
        />
        <Input
          style={{ width: '140px' }}
          defaultValue="10"
          onChange={(e) => setDisturbInputNumber(e.target.value)}
          addonBefore="干扰数目"
        ></Input>
        <Input
          style={{ width: '140px' }}
          defaultValue="0.5"
          onChange={(e) => setIntensityInputNumber(e.target.value)}
          addonBefore="强度倍率"
        />
        <Button
          style={{
            backgroundColor: '#0D93F7',
            color: 'white',
            // marginBottom: '10px',
            height: '31px',
          }}
          onClick={() => {
            setIntensityNumber(intensityInputNumber);
            setOptions(options);
            setRangeNumber(inputNumber);
            setDisturbNumber(disturbInputNumber);
            setKeyNumber(new Date());
          }}
        >
          刷新
        </Button>
      </Space>
      <ReactECharts option={options} key={keyNumber} style={{ height: 600 }}></ReactECharts>
    </Modal>
  );
};

export default ProteinFixedChartsForm;
