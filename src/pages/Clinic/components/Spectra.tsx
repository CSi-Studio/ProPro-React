/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import { Modal, Tag } from 'antd';
import ReactECharts from 'echarts-for-react';

export type spectrumProps = {
  handleCancel: () => void;
  spectrumVisible: boolean;
  values: any;
};
const Spectrum: React.FC<spectrumProps> = (props) => {
  const [handleOption, setHandleOption] = useState({});

  const xData = props?.values?.data?.x.map((value: number) => {
    return { value };
  });
  const yData = props?.values?.data?.y.map((value: number) => {
    return { value };
  });

  /* 存放碎片mz和碎片name */
  const cutInfoMap: any = [];
  props?.values?.expData?.forEach((_item: { cutInfoMap: Record<string, number> }) => {
    Object.keys(_item.cutInfoMap).forEach((key: any) => {
      cutInfoMap.push({ data: _item.cutInfoMap[key], name: key });
    });
  });
  console.log([...new Set(cutInfoMap)]);

  /* 筛出+—0.015范围内的y值和x值 添加碎片name */
  let chooseValue: any = [];
  cutInfoMap.forEach((item: any) => {
    props?.values?.data?.x.forEach((value: number, index: number) => {
      if (value > item.data - 0.015 && value < item.data + 0.015) {
        chooseValue.push({ data: yData[index].value, name: item.name, index });
        yData[index] = {
          value: 0,
        };
      }
    });
  });

  const map = new Map();
  for (const i of chooseValue) {
    if (!map.has(i.data)) {
      map.set(i.data, i);
    }
  }
  chooseValue = [...map.values()];
  const series: any = [
    {
      large: true,
      type: 'bar',
      legendHoverLink: true,
      data: yData,
      name: '123',
    },
  ];
  console.log('chooseValue', chooseValue);

  chooseValue.forEach((value: { data: any; name: any; index: number }) => {
    const result = new Array(props?.values?.data?.x.length).fill(0);
    result[value.index] = value.data;

    series.push({
      large: true,
      type: 'bar',
      legendHoverLink: true,
      data: result,
      name: value.name,
    });
  });
  useEffect(() => {
    const option = {
      grid: {
        top: '2%',
        left: '4%',
        right: '2%',
        bottom: '11%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        silent: false,
        splitLine: {
          show: false,
        },
        splitArea: {
          show: false,
        },
        nameLocation: 'middle',
        name: '',
        nameGap: 30,
        data: xData,
        scale: true,
        axisLabel: {
          color: '#000',
          show: true,
          fontFamily: 'Times New Roman,STSong',
          fontWeight: 'normal',
          formatter: (value: number) => {
            return (value * 1).toFixed(2);
            // return value;
          },
        },
        nameTextStyle: {
          color: '#000',
          fontSize: '16',
          fontWeight: 'bold',
          fontFamily: 'Times New Roman,STSong',
          align: 'left',
        },
      },
      yAxis: {
        type: 'value',
        nameRotate: 90,
        nameGap: 30,
        nameLocation: 'middle',
        name: '',
        splitArea: {
          show: false,
        },
        scale: true,
        axisLabel: {
          color: '#000',
          show: true,
          fontFamily: 'Times New Roman,STSong',
          fontWeight: 'normal',
        },
        nameTextStyle: {
          color: '#000',
          fontSize: '16',
          fontWeight: 'bold',
          fontFamily: 'Times New Roman,STSong',
          align: 'left',
        },
      },
      animation: false,
      toolbox: {
        feature: {
          restore: {},
          dataView: {},
          saveAsImage: {},
        },
      },
      dataZoom: [
        {
          type: 'inside',
        },
        {
          type: 'slider',
        },
      ],
      tooltip: {
        trigger: 'item',
        backgroundColor: ['rgba(255,255,255,0.9)'],
        axisPointer: {
          type: 'cross',
          snap: true,
        },
        textStyle: {
          color: '#000',
          fontSize: '14',
          fontWeight: 'normal',
          fontFamily: 'Times New Roman,STSong',
        },
      },
      legend: {
        right: '12%',
        align: 'left',
        textStyle: {
          fontSize: '14',
          fontFamily: 'Times New Roman,STSong',
        },
      },
      series,
    };
    setHandleOption(option);
  }, [props.values]);

  return (
    <Modal
      width={'45vw'}
      centered={true}
      title={
        <>
          光谱图 <Tag>rt：{window?.paramsTool ? window?.paramsTool[0]?.axisValue : null}</Tag>
        </>
      }
      onCancel={props.handleCancel}
      visible={props.spectrumVisible}
      footer={[]}
      // maskClosable={false}
    >
      <ReactECharts
        option={handleOption}
        style={{ width: `100%`, height: '400px' }}
        lazyUpdate={true}
      />
    </Modal>
  );
};

export default Spectrum;
