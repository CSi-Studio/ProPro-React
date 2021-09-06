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
  const [disturbNumber, setDisturbNumber] = useState<any>(10);
  const [disturbInputNumber, setDisturbInputNumber] = useState<any>(10);
  const [intensityInputNumber, setIntensityInputNumber] = useState<any>(0.5);
  const [intensityNumber, setIntensityNumber] = useState<any>(0.5);
  const [keyNumber, setKeyNumber] = useState<any>('new date');
  const data = props?.chartsData;
  useEffect(() => {
    data?.nodes?.forEach((node: any) => {
      (node.label = {
        show: node.symbolSize > 22,
      }),
        (node.tooltip = {
          formatter: 'peptide:{b} <br /> mz&rt:{c0}',
        }),
        (node.itemStyle = {}),
        data?.count?.forEach((link: any) => {
          if (link.name === node.id && link.number >= disturbNumber) {
            (node.itemStyle = {
              color: '#FFF',
            }),
              (node.label = {
                show: true,
                formatter: `${link.number}`,
                position: 'inside',
                color: '#000',
                fontWeight: 'bolder',
              });
          }
        });
    });
    data?.links?.forEach((link: any) => {
      link.lineStyle = null;
      if (
        link.value < rangeNumber &&
        link.target.indexOf('-') !== -1 &&
        link.source.indexOf('-') != -1
      ) {
        data?.intensity?.forEach((intensity: any) => {
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
    setIntensityNumber(intensityInputNumber);
    setRangeNumber(inputNumber);
    setDisturbNumber(disturbInputNumber);
    const getOption = () => {
      const option = {
        title: {
          text: props.proteinName,
          top: 'top',
          left: 'right',
        },
        tooltip: {},
        legend: [
          {
            selectedMode: 'multiple',
            data: data?.categories?.map((a: any) => {
              return a.name;
            }),
            top: '5%',
            left: 'right',
          },
        ],
        animationDuration: 600,
        animationEasingUpdate: 'quinticInOut',
        series: [
          {
            type: 'graph',
            draggable: true,
            name: props?.proteinName,
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
              type: [5, 10],
              dashOffset: 5,
              width: 2,
              cap: 'round',
              join: 'round',
              curveness: 0.1,
            },
            emphasis: {
              focus: 'adjacency',
              lineStyle: {
                width: 10,
                cap: 'round',
                join: 'round',
              },
            },
            itemStyle: {
              borderJoin: 'round',
              borderCap: 'round',
            },
          },
        ],
      };
      return option;
    };
    setOptions(getOption());
  }, [
    props,
    inputNumber,
    disturbInputNumber,
    intensityInputNumber,
    data,
    disturbNumber,
    rangeNumber,
    intensityNumber,
  ]);

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
      }}
      onCancel={props.onCancel}
    >
      <Space direction="horizontal">
        <Input
          style={{ width: '120px' }}
          defaultValue="10"
          onChange={(e) => {
            setInputNumber(e.target.value);
            console.log('我变了');
          }}
          addonBefore="rt范围"
        />
        <Input
          style={{ width: '140px' }}
          defaultValue="10"
          onChange={(e) => setDisturbInputNumber(e.target.value)}
          addonBefore="干扰数目"
        />
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
            // setOptions(options);
            setRangeNumber(inputNumber);
            setDisturbNumber(disturbInputNumber);
            setKeyNumber(new Date());
          }}
        >
          刷新
        </Button>
      </Space>
      <ReactECharts
        notMerge={true}
        lazyUpdate={true}
        key={keyNumber}
        option={options}
        style={{ height: 600 }}
      />
    </Modal>
  );
};

export default ProteinFixedChartsForm;
