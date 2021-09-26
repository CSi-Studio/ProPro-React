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
    const gridHeight: number = 240;
    const xName: string = '';
    const yName: string = '';
    const gridPaddingHeight: number = 80;
    const totalPaddingHeight: number = 50;
    const gridPaddingWight: number = 3;
    const totalPaddingWidth: number = 3;
    const titleHeight: number = 20;
    const Width: number = 99;


    /* 设置series */
    const series: any[] = [];
    const seriesData: any[] = [];
    Object.keys(props.values.rtPairs.data).forEach((key) => {
      const pairsInit: any = { alias: '', value: [] };
      props.values.rtPairs.data[key].x.forEach((x: number, index: number) => {
        props.values.expData.forEach((item: { expId: string; alias: string }) => {
          if (item.expId === key) {
            pairsInit.alias = item.alias;
            pairsInit.value.push([
              x,
              props.values.rtPairs.data[key].y[index],
              props.values.rtPairs.data[key].peptideRefs[index],
            ]);
          }
        });
      });
      seriesData.push(pairsInit);
    });
    seriesData.sort((a: { alias: string }, b: { alias: string }) => (a.alias > b.alias ? 1 : -1));
    seriesData.forEach((item, idx) => {
      series.push({
        xAxisIndex: idx,
        yAxisIndex: idx,
        type: 'scatter',
        name: item.alias,
        symbolSize: 2,
        animation: false,
        data: item.value,
        large: true,
      });
    });

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
      seriesData.forEach((item, idx) => {
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
      });
      titles.sort((a: { text: string }, b: { text: string }) => (a.text > b.text ? 1 : -1));
      // console.log(titles);
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

    const option = {
      title: getXicTitle(),
      grid: getXicGrids(seriesData.length),
      xAxis: getXicxAxis(seriesData.length, xName),
      yAxis: getXicyAxis(seriesData.length, yName),
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
          // console.log(params);

          let res = params.seriesName;
          res += `<br />肽段：${params.data[2]}<br />${params.marker}${
            params.data[0]
          } &nbsp ${params.data[1]?.toFixed(4)}`;
          return res;
        },
      },
      // legend: {
      //   right: '8%',
      //   align: 'left',
      //   textStyle: {
      //     fontSize: '14',
      //     fontFamily: 'Times New Roman,STSong',
      //   },
      // },
      dataZoom: getDataZoom(),
      series,
    };
    setHandleOption(option);
  }, []);

  return (
    <Row>
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

// title 辅助线 +-100 选中的 未选中的 选中的占总数的百分比 tooltip
