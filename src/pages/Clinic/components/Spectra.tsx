import React, { useEffect, useState } from 'react';
import { Modal, Tag } from 'antd';
import ReactECharts from 'echarts-for-react';

export type spectrumProps = {
  handleCancel: () => void;
  spectrumVisible: boolean;
  values: any;
};

// const chooseFn = (arr1: any[], arr2: any[], value: number) => {
//   let a = [];
//   arr1.forEach((item) => {
//     arr2.forEach((_item) => {
//       if (_item - value < item && _item + value > item) {
//         a.push(item);
//       }
//     });
//   });
//   return a;
// };

const Spectrum: React.FC<spectrumProps> = (props) => {
  const [handleOption, setHandleOption] = useState({});

  const xData = props?.values?.data?.x.map((value: number) => {
    return { value };
  });
  const yData = props?.values?.data?.y.map((value: number) => {
    return { value };
  });

  const a: number[] = [];
  props?.values?.expData?.forEach((_item: { cutInfoMap: Record<string, number> }) => {
    Object.keys(_item.cutInfoMap).forEach((key: any) => {
      a.push(_item.cutInfoMap[key]);
    });
  });

  const yyData: any[] = [];
  a.forEach((item: any) => {
    props?.values?.data?.x.forEach((value: number, index: number) => {
      if (value > item - 0.015 && value < item + 0.015) {
        yyData.push({ value: props?.values?.data?.x[index], itemStyle: { color: 'tomato' } });
      } else {
        yyData.push({ value: props?.values?.data?.x[index] });
      }
    });
  });

  // function unique(arr) {
  //   for (var i = 0; i < arr.length; i++) {
  //     for (var j = i + 1; j < arr.length; j++) {
  //       if (arr[i].value === arr[j].value) {
  //         //第一个等同于第二个，splice方法删除第二个
  //         arr.splice(j, 1);
  //         j--;
  //       }
  //     }
  //   }
  //   return arr;
  // }
  // console.log(unique(yyData));

  useEffect(() => {
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
      <ReactECharts
        option={handleOption}
        style={{ width: `100%`, height: '400px' }}
        lazyUpdate={true}
      />
    </Modal>
  );
};

export default Spectrum;
