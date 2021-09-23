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
  // const [chooseValue, setChooseValue] = useState();

  const xData = props?.values?.data?.x.map((value: number) => {
    return { value };
  });
  const yData = props?.values?.data?.y.map((value: number) => {
    return { value, name: '未被选中' };
  });

  const a: number[] = [];
  props?.values?.expData?.forEach((_item: { cutInfoMap: Record<string, number> }) => {
    Object.keys(_item.cutInfoMap).forEach((key: any) => {
      a.push(_item.cutInfoMap[key]);
    });
  });

  let chooseValue: any[] = [];
  a.forEach((item: any) => {
    props?.values?.data?.x.forEach((value: number, index: number) => {
      if (value > item - 0.015 && value < item + 0.015) {
        chooseValue.push(value);
        yData[index] = {
          value: yData[index].value,
          itemStyle: { color: 'tomato' },
          name: '被选中',
        };
      }
    });
  });
  chooseValue = Array.from(new Set(chooseValue));

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
        silent: false,
        splitLine: {
          show: false,
        },
        splitArea: {
          show: false,
        },
        nameLocation: 'middle',
        name: 'X',
        nameGap: 30,
        type: 'category',
        data: xData,
        scale: true,
        axisLabel: {
          color: '#000',
          show: true,
          fontFamily: 'Times New Roman,STSong',
          fontWeight: 'normal',
          formatter: (value: number) => {
            return (value * 1).toFixed(2);
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
        name: 'Y',
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
        backgroundColor: ['rgba(255,255,255,0.9)'],
        axisPointer: {
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
      series: [
        {
          large: true,
          type: 'bar',
          legendHoverLink: true,
          data: yData,
        },
      ],
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
      {chooseValue.map((_item: number) => {
        return <Tag key={_item.toString()}>{_item}</Tag>;
      })}
      <ReactECharts
        option={handleOption}
        style={{ width: `100%`, height: '400px' }}
        lazyUpdate={true}
      />
    </Modal>
  );
};

export default Spectrum;
