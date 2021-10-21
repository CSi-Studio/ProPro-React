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
  let cutInfoMap: any = [];
  props?.values?.expData?.forEach((_item: { cutInfoMap: Record<string, number> }) => {
    Object.keys(_item.cutInfoMap).forEach((key: any) => {
      cutInfoMap.push({ data: _item.cutInfoMap[key], name: key });
    });
  });
  const unique = (arr: any[]) => {
    const res = new Map();
    return arr.filter((value) => !res.has(value.name) && res.set(value.name, 1));
  };

  cutInfoMap = unique(cutInfoMap);

  /* 筛出+—0.015范围内的y值和x值 添加碎片name */
  const chooseValue: any = [];
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

  const cutInfoName = Array.from(
    new Set(
      chooseValue.map((item: any) => {
        return item.name;
      }),
    ),
  );

  const series: any = [];

  const result: any = [];
  const leftResult: any = [];
  const rightResult: any = [];
  const midZerResult: any = [];
  cutInfoName.forEach((value: any) => {
    let cutInfoData: any[] = [value];
    const chooseData: any = [];
    const leftData: any[] = [value];
    const rightData: any[] = [];
    const b: any = [];

    const midZerData: any[] = [];
    chooseValue.forEach((item: { name: string; data: any; index: number }) => {
      if (item.name === value) {
        cutInfoData.push(item.data);
        midZerData.push(0);
        chooseData.push(item.index);
      }
    });

    for (let index = 1; index < 11; index += 1) {
      leftData.push(props?.values?.data?.y[Math.min(...chooseData) - index]);
      rightData.push(props?.values?.data?.y[Math.max(...chooseData) + index]);
    }
    cutInfoData.splice(1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    cutInfoData = cutInfoData.concat(new Array(10).fill(0));

    result.push(cutInfoData);
    midZerResult.push(b.concat(leftData).concat(midZerData).concat(rightData));

    leftResult.push(leftData);
    rightResult.push(rightData);
  });

  const resLength: any = [];
  result.forEach((item: any) => {
    resLength.push(item.length);
  });

  for (let index = 0; index < Math.max(...resLength) - 1; index += 1) {
    series.push({
      type: 'bar',
      legendHoverLink: true,
      stack: index,
      datasetIndex: 0,
      color: 'tomato',
      // name: item,
    });
    series.push({
      type: 'bar',
      legendHoverLink: true,
      stack: index,
      datasetIndex: 1,
      color: '#4090F7',
      // name: item,
    });
  }

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
        data: cutInfoName,
        scale: true,
        axisPointer: {
          type: 'shadow',
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
      dataset: [
        {
          source: result,
        },
        { source: midZerResult },
      ],
      dataZoom: [
        {
          type: 'inside',
        },
        {
          type: 'slider',
        },
      ],
      tooltip: {
        trigger: 'axis',
        // backgroundColor: ['rgba(255,255,255,0.9)'],
        axisPointer: {
          type: 'cross',
          snap: true,
          crossStyle: {
            color: '#999',
          },
        },
        textStyle: {
          color: '#000',
          fontSize: '14',
          fontWeight: 'normal',
          fontFamily: 'Times New Roman,STSong',
        },
        formatter: {},
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
