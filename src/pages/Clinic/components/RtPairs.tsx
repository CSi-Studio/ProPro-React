import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Col, Row, Tag } from 'antd';

export type QtChartsProps = {
  values: any;
};

const RtPairsCharts: React.FC<QtChartsProps> = (props: any) => {
  const [handleOption, setHandleOption] = useState({});
  // const [pairsData, setRatioData] = useState<any>();

  useEffect(() => {
    const gridNumInRow: number = 3;
    const gridHeight: number = 200;
    const xName: string = '';
    const yName: string = '';
    const gridPaddingHeight: number = 80;
    const totalPaddingHeight: number = 90;
    const gridPaddingWight: number = 3;
    const totalPaddingWidth: number = 3;
    const titleHeight: number = 50;
    const Width: number = 99;

    // console.log(props);

    /* 设置series */
    const series: any[] = [];
    Object.keys(props.values.rtPairs.data).forEach((key, idx) => {
      const pairsInit: any[][][] = [];
      props.values.rtPairs.data[key].x.forEach((x: number, index: number) => {
        return pairsInit.push([
          x,
          props.values.rtPairs.data[key].y[index],
          props.values.rtPairs.data[key].peptideRefs[index],
        ]);
      });

      props.values.expData.forEach((item: { expId: string; alias: string }) => {
        if (item.expId === key) {
          series.push({
            xAxisIndex: idx,
            yAxisIndex: idx,
            type: 'scatter',
            name: item.alias,
            symbolSize: 2,
            animation: false,
            // color: 'rgba(255,99,71,0.5)',
            data: pairsInit,
            // itemStyle: { borderWidth: 1, borderColor: '#888' },
            large: true,
          });
        }
      });
    });
    series.sort((a: { name: string }, b: { name: string }) => (a.name > b.name ? 1 : -1));
    // console.log(series);

    // 设置Grids布局
    const getXicGrids = (count: number) => {
      const grids: any = [];
      for (let i: number = 0; i < count; i += 1) {
        const j: any = {
          left: `${(i % gridNumInRow) * Math.floor(Width / gridNumInRow) + totalPaddingWidth}%`,
          top: `${
            (gridHeight + gridPaddingHeight) * Math.floor(i / gridNumInRow) + totalPaddingHeight
          }px`,
          width: `${Math.floor(Width / gridNumInRow) - gridPaddingWight}%`,
          height: `${gridHeight}px`,
          show: 'true',
          // backgroundColor: `${statusFn(
          //   data[i].status,
          //   '#000',
          //   'rgba(215,236,184)',
          //   'rgba(241,158,156,0.3)',
          //   'rgba(251,229,154,0.5)',
          //   'rgba(251,229,154,0.5)',
          // )}`,
        };
        grids.push(j);
      }
      return grids;
    };

    // 设置表头
    const getXicTitle = () => {
      const titles: any[] = [];
      Object.keys(props.values.rtPairs.data).forEach((key, idx) => {
        props.values.expData.forEach((item: { expId: string; alias: string }) => {
          if (item.expId === key) {
            const xicTitle = {
              text: item.alias,
              height: '200px',
              textAlign: 'center',
              textStyle: {
                color: '#000',
                fontSize: '14',
                fontWeight: 'normal',
                fontFamily: 'Times New Roman,STSong',
              },

              padding: 0,
              left: `${
                (idx % gridNumInRow) * Math.floor(Width / gridNumInRow) +
                Math.floor((Math.floor(Width / gridNumInRow) - gridPaddingWight) / 2) +
                totalPaddingWidth
              }%`,
              top: `${
                (gridHeight + gridPaddingHeight) * Math.floor(idx / gridNumInRow) +
                totalPaddingHeight -
                titleHeight
              }px`,
            };
            titles.push(xicTitle);
          }
        });
      });
      titles.sort((a: { text: string }, b: { text: string }) => (a.text > b.text ? 1 : -1));
      console.log(titles);

      // for (let i = 0; i < props.values.expData.length; i += 1) {
      //   const item = {
      //     text: props.values.expData[i].alias,
      //     height: '200px',
      //     textAlign: 'center',
      //     textStyle: {
      //       color: '#000',
      //       fontSize: '14',
      //       fontWeight: 'normal',
      //       fontFamily: 'Times New Roman,STSong',
      //     },

      //     padding: 0,
      //     left: `${
      //       (i % gridNumInRow) * Math.floor(Width / gridNumInRow) +
      //       Math.floor((Math.floor(Width / gridNumInRow) - gridPaddingWight) / 2) +
      //       totalPaddingWidth
      //     }%`,
      //     top: `${
      //       (gridHeight + gridPaddingHeight) * Math.floor(i / gridNumInRow) +
      //       totalPaddingHeight -
      //       titleHeight
      //     }px`,
      //   };
      //   titles.push(item);
      // }
      return titles;
    };

    // 设置缩放zoom
    const getDataZoom = () => {
      const grids: any = [];
      for (let i = 0; i < props.values.expData.length; i += 1) {
        const item: any = {
          type: 'inside',
          xAxisIndex: i,
        };
        grids.push(item);
      }
      return grids;
    };

    // 设置x轴
    const getXicxAxis = (count: number, axisName: string) => {
      const xAxis = [];
      for (let i = 0; i < count; i += 1) {
        xAxis.push({
          gridIndex: i,
          name: axisName,
          splitLine: {
            show: false,
          },
          nameGap: 80,
          nameLocation: 'middle',
          // boundaryGap: false,
          scale: true,
          axisLabel: {
            color: '#000',
            show: true,
            fontFamily: 'Times New Roman,STSong',
            fontWeight: 'normal',
            formatter(params: number) {
              return params > 10000 ? params.toExponential(1) : params;
            },
          },
          nameTextStyle: {
            color: '#000',
            fontSize: '16',
            fontWeight: 'bold',
            fontFamily: 'Times New Roman,STSong',
            align: 'left',
          },
        });
      }
      return xAxis;
    };
    // 设置y轴
    const getXicyAxis = (count: number, axisName: string) => {
      const yAxis: any[] = [];
      for (let i = 0; i < count; i += 1) {
        yAxis.push({
          gridIndex: i,
          name: axisName,
          splitLine: {
            show: false,
          },
          nameGap: 80,
          nameLocation: 'middle',
          // boundaryGap: false,
          scale: true,
          axisLabel: {
            color: '#000',
            show: true,
            fontFamily: 'Times New Roman,STSong',
            fontWeight: 'normal',
            formatter(params: number) {
              return params > 10000 ? params.toExponential(1) : params;
            },
          },
          nameTextStyle: {
            color: '#000',
            fontSize: '16',
            fontWeight: 'bold',
            fontFamily: 'Times New Roman,STSong',
            align: 'left',
          },
        });
      }
      return yAxis;
    };
    const data = [];
    Object.keys(props.values.rtPairs.data).forEach((key) => {
      data.push(props.values.rtPairs.data[key]);
    });

    const option = {
      title: getXicTitle(),
      grid: getXicGrids(data.length),
      xAxis: getXicxAxis(data.length, xName),
      yAxis: getXicyAxis(data.length, yName),
      animation: false,
      toolbox: {
        feature: {
          restore: {},
          dataView: {},
          saveAsImage: {},
        },
      },
      color: [
        '#1890ff',
        'hotpink',
        '#3CB371',
        'orange',
        '#9370D8',
        'tomato',
        '#71d8d2',
        '#FFa246',
        '#6C97D7',
        '#F4B397',
        '#395165',
        '#F2DF5D',
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
        formatter: (params: { seriesName: any; data: number[]; marker: any }) => {
          console.log(params);

          let res = params.seriesName;
          res += `<br />肽段：${params.data[2]}<br />${params.marker}${params.data[0]?.toFixed(
            4,
          )} &nbsp ${params.data[1]?.toFixed(4)}`;
          return res;
        },
      },
      legend: {
        right: '8%',
        align: 'left',
        textStyle: {
          fontSize: '14',
          fontFamily: 'Times New Roman,STSong',
        },
      },
      dataZoom: getDataZoom(),
      series,
    };
    setHandleOption(option);
  }, []);

  return (
    <Row>
      {/* <Col span="5">
        <Descriptions title="蛋白鉴定数(Unique)" column={2}>
          <Descriptions.Item label="A">
            <Tag color="blue">{ratioData?.identifyProteinNumA}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="B">
            <Tag color="blue">{ratioData?.identifyProteinNumB}</Tag>
          </Descriptions.Item>
        </Descriptions>
        <Descriptions title="肽段鉴定数(Unique)" column={2}>
          <Descriptions.Item label="A">
            <Tag color="blue">{ratioData?.identifyNumA}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="缺失率">
            <Tag color="red">{`${(ratioData?.missingRatioA * 100).toFixed(2)}%`}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="B">
            <Tag color="blue">{ratioData?.identifyNumB}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="缺失率">
            <Tag color="red">{`${(ratioData?.missingRatioB * 100).toFixed(2)}%`}</Tag>
          </Descriptions.Item>
        </Descriptions>
        <Descriptions title="Hit比例(1:2:3)" column={1}>
          <Descriptions.Item label="A">
            <Tag color="red">{ratioData?.hit1A}</Tag>
            <Tag color="blue">{ratioData?.hit2A}</Tag>
            <Tag color="green">{ratioData?.hit3A}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="A.Ratio">
            <Tag color="red">{`${((ratioData?.hit1A * 100) / ratioData?.identifyNumA).toFixed(
              2,
            )}%`}</Tag>
            <Tag color="blue">{`${((ratioData?.hit2A * 100) / ratioData?.identifyNumA).toFixed(
              2,
            )}%`}</Tag>
            <Tag color="green">{`${((ratioData?.hit3A * 100) / ratioData?.identifyNumA).toFixed(
              2,
            )}%`}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="B">
            <Tag color="red">{ratioData?.hit1B}</Tag>
            <Tag color="blue">{ratioData?.hit2B}</Tag>
            <Tag color="green">{ratioData?.hit3B}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="B.Ratio">
            <Tag color="red">{`${((ratioData?.hit1B * 100) / ratioData?.identifyNumB).toFixed(
              2,
            )}%`}</Tag>
            <Tag color="blue">{`${((ratioData?.hit2B * 100) / ratioData?.identifyNumB).toFixed(
              2,
            )}%`}</Tag>
            <Tag color="green">{`${((ratioData?.hit3B * 100) / ratioData?.identifyNumB).toFixed(
              2,
            )}%`}</Tag>
          </Descriptions.Item>
        </Descriptions>
        <Descriptions title="Yeast(Avg:SD:CV)" column={1}>
          <Descriptions.Item label="Stat">
            <Tag color="blue">{ratioData?.yeastAvg.toFixed(4)}</Tag>
            <Tag color="blue">{ratioData?.yeastCV.toFixed(4)}</Tag>
            <Tag color="blue">{ratioData?.yeastSD.toFixed(4)}</Tag>
          </Descriptions.Item>
        </Descriptions>
        <Descriptions title="Human(Avg:SD:CV)" column={1}>
          <Descriptions.Item label="Stat">
            <Tag color="blue">{ratioData?.humanAvg.toFixed(4)}</Tag>
            <Tag color="blue">{ratioData?.humanCV.toFixed(4)}</Tag>
            <Tag color="blue">{ratioData?.humanSD.toFixed(4)}</Tag>
          </Descriptions.Item>
        </Descriptions>
        <Descriptions title="EColi(Avg:SD:CV)" column={1}>
          <Descriptions.Item label="Stat">
            <Tag color="blue">{ratioData?.ecoliAvg.toFixed(4)}</Tag>
            <Tag color="blue">{ratioData?.ecoliCV.toFixed(4)}</Tag>
            <Tag color="blue">{ratioData?.ecoliSD.toFixed(4)}</Tag>
          </Descriptions.Item>
        </Descriptions>
      </Col> */}
      <Col span="24">
        <ReactECharts
          option={handleOption}
          style={{ width: `100%`, height: '700px' }}
          lazyUpdate={true}
        />
      </Col>
    </Row>
  );
};

export default RtPairsCharts;

// title 辅助线 +-150 选中的 未选中的 选中的占总数的百分比 tooltip
