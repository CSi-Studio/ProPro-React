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
  // console.log('chooseValue--', chooseValue);
  // console.log('cutInfoMap--', cutInfoMap);

  chooseValue.forEach((value: any) => {
    // for (let i = 1; i < 11; i++) {
    //   a.push(props?.values?.data?.y[value.index - i]);
    // }
    // result.push({ data: value.data, name: value.name });
    // result.name = value.name;
  });
  // console.log(result);

  const cutInfoName = Array.from(
    new Set(
      chooseValue.map((item: any) => {
        return item.name;
      }),
    ),
  );

  const series: any = [];

  const result = cutInfoName.map((item: any, index: number) => {
    const data: any[] = [];
    chooseValue.forEach((_item: { name: unknown; data: any }) => {
      if (item === _item.name) {
        // _item.data.forEach((value: any) => {
        data.push(_item.data);
        // });
      }
    });
    series.push({
      large: true,
      type: 'bar',
      legendHoverLink: true,
      data,
      // name: item,
    });
    return { data, name: item };
  });
  // console.log('result', result);
  // chooseValue.forEach((value: { data: any; name: any; index: number }) => {
  // const result = new Array(props?.values?.data?.x.length).fill(0);
  // result[value.index] = value.data;
  // result[value.name] = value;
  // series.push({
  //   large: true,
  //   type: 'bar',
  //   legendHoverLink: true,
  //   data: result,
  //   name: value.name,
  // });
  // });
  // console.log(series);

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
        // data: xData,
        data: cutInfoName,
        scale: true,
        // axisLabel: {
        //   color: '#000',
        //   show: true,
        //   fontFamily: 'Times New Roman,STSong',
        //   fontWeight: 'normal',
        //   formatter: (value: number) => {
        //     return (value * 1).toFixed(2);
        //     // return value;
        //   },
        // },
        // nameTextStyle: {
        //   color: '#000',
        //   fontSize: '16',
        //   fontWeight: 'bold',
        //   fontFamily: 'Times New Roman,STSong',
        //   align: 'left',
        // },
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
