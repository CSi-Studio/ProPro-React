import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import ReactECharts from 'echarts-for-react';

export type spectrumProps = {
  handleCancel: () => void;
  spectrumVisible: boolean;
  values: any;
};
const Spectrum: React.FC<spectrumProps> = (props) => {
  const [handleOption, setHandleOption] = useState({});

  useEffect(() => {
    const xData = props?.values?.data?.x?.map((value: number) => {
      return {
        value: value,
        itemStyle: {
          color: 'tomato',
        },
      };
    });

    // 设置标注区域
    const getMarkArea = () => {
      const markAreaOpt: any = {
        animation: false,
        // lineStyle: {
        //   type: 'dashed',
        //   color: '#777',
        // },
        // emphasis: {
        //   lineStyle: {
        //     type: 'solid',
        //     color: 'tomato',
        //     width: 2,
        //   },
        // },
        // silent: true, // 图形是不响应和触发鼠标事件
        // tooltip: {
        //   formatter: '{a}',
        //   item: 'none',
        //   axisPointer: {
        //     label: {
        //       fontFamily: 'Times New Roman,STSong',
        //     },
        //   },
        // },
        // label: { show: false },
        itemStyle: { color: 'tomato' },
        data: [],
      };

      props?.values?.expData?.forEach((item: { cutInfoMap: [] }) => {
        Object.keys(item.cutInfoMap).forEach((key: any) => {
          markAreaOpt.data.push([
            {
              xAxis: item.cutInfoMap[key] - 0.015,
            },
            {
              xAxis: item.cutInfoMap[key] + 0.015,
            },
          ]);
        });
      });
      return markAreaOpt;
    };

    const option = {
      grid: {
        top: '2%',
        left: '4%',
        right: '2%',
        bottom: '4%',
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
        nameGap: 20,
        type: 'category',
        data: xData,
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
      series: [
        // {
        //   large: true,
        //   type: 'bar',
        //   legendHoverLink: true,
        //   data: props?.values?.data?.y,
        //   // itemStyle: {
        //   //   color: 'tomato',
        //   // },
        //   // markArea: getMarkArea(),
        // },
        {
          type: 'line',
          legendHoverLink: true,
          data: props?.values?.data?.y,
          // itemStyle: {
          //   color: 'tomato',
          // },
          markArea: getMarkArea(),
        },
      ],
    };
    console.log('option1---', option);

    setHandleOption(option);
  }, [props.values]);

  return (
    <Modal
      width={'45vw'}
      centered={true}
      title="光谱图"
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
