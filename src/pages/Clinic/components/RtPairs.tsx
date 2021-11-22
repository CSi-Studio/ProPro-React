import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Col, Row, message } from 'antd';

export type QtChartsProps = {
  values: any;
};
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

const RtPairsCharts: React.FC<QtChartsProps> = (props: any) => {
  const { runData, rtPairs } = props.values;
  const [handleOption, setHandleOption] = useState<any>({});
  /* 获取echarts实例，使用其Api */
  const [echarts, setEcharts] = useState<any>();

  const Height = Math.ceil(runData.length / gridNumInRow) * (gridHeight + gridPaddingHeight);
  const getOption = async () => {
    try {
      const getMarkLine = (length: number) => {
        if (length === 0) {
          return null;
        }
        const markLineOpt = {
          symbol: ['none', 'none'],
          animation: false,
          lineStyle: {
            type: 'dashed',
            color: '#333',
            width: 2,
          },
          emphasis: {
            lineStyle: {
              type: 'dashed',
              color: 'gold',
              width: 3,
            },
          },
          label: {
            show: false,
          },
          data: [{ yAxis: 100 }, { yAxis: -100 }],
        };
        return markLineOpt;
      };

      /* 设置series */
      const series: any[] = [];
      const seriesData: any[] = [];

      Object.keys(rtPairs.data).forEach((key) => {
        const pairsInit: any = { alias: '', value: [] };
        rtPairs.data[key].x.forEach((x: number, index: number) => {
          runData.forEach((item: { runId: string; alias: string }) => {
            if (item.runId === key) {
              pairsInit.alias = item.alias;
              pairsInit.value.push([
                x,
                rtPairs.data[key].y[index],
                rtPairs.data[key].peptideRefs[index],
                rtPairs.data[key].libRts[index],
              ]);
            }
          });
        });
        seriesData.push(pairsInit);
      });
      seriesData.sort((a: { alias: string }, b: { alias: string }) => (a.alias > b.alias ? 1 : -1));

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
        return titles;
      };

      // 设置缩放zoom
      const getDataZoom = () => {
        const grids: any = [];
        for (let i = 0; i < runData.length; i += 1) {
          const item: any = {
            type: 'inside',
            xAxisIndex: i,
          };
          grids.push(item);
        }
        return grids;
      };

      // 设置graphic自定义图形
      let itemIndex = 0;
      const ratio: any = [];
      seriesData.forEach((item, idx) => {
        itemIndex = 0;
        item.value.forEach((value: number[]) => {
          if (value[1] > -100 && value[1] < 100) {
            itemIndex += 1;
          }
        });
        ratio.push((itemIndex / item.value.length) * 100);
        series.push({
          xAxisIndex: idx,
          yAxisIndex: idx,
          type: 'scatter',
          name: item.alias,
          symbolSize: 4,
          animation: false,
          data: item.value,
          large: true,
          markLine: getMarkLine(seriesData.length),
        });
      });
      const getGraphic = () => {
        const graphic: any = [];
        ratio.forEach((item: any, index: number) => {
          graphic.push({
            type: 'group',
            left: `${
              (index % gridNumInRow) * Math.floor(Width / gridNumInRow) +
              Math.floor((Math.floor(Width / gridNumInRow) - gridPaddingWight) / 2) +
              totalPaddingWidth -
              14
            }%`,
            top: `${
              (gridHeight + gridPaddingHeight) * Math.floor(index / gridNumInRow) +
              totalPaddingHeight -
              titleHeight +
              30
            }px`,
            children: [
              {
                type: 'rect',
                z: 100,
                left: '0',
                top: '0',
                shape: {
                  width: 60,
                  height: 16,
                },
                style: {
                  fill: '#fff',
                  stroke: '#555',
                  lineWidth: 1,
                  borderRadius: 4,
                  // shadowBlur: 8,
                  // shadowOffsetX: 3,
                  // shadowOffsetY: 3,
                  // shadowColor: 'rgba(0,0,0,0.2)',
                },
              },
              {
                type: 'text',
                z: 100,
                left: '10',
                top: '2',
                style: {
                  fill: '#333',
                  width: 200,
                  overflow: 'break',
                  text: `${item.toFixed(2)}%`,
                  font: '14px Times New Roman,STSong',
                },
              },
            ],
          });
        });
        return graphic;
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
          'rgba(255,99,71)',
          'rgba(64,144,247)',
          'rgba(60,179,113)',
          'orange',
          '#9370D8',
          '#71d8d2',
          '#FFa246',
          '#6C97D7',
          '#F4B397',
          '#395165',
          '#F2DF5D',
        ],
        tooltip: {
          enterable: true,
          trigger: 'axis',
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
          formatter: (params: any) => {
            let res = '';
            params.forEach((item: any) => {
              res += `${item.marker}${item.seriesName}<br />肽段：${item.data[2]}<br />ApexRt: ${
                item.data[0]
              } <br /> Delta: ${item.data[1]?.toFixed(4)}<br /> LibRts: ${item.data[3]}<br />`;
            });
            return res;
          },
        },
        dataZoom: getDataZoom(),
        graphic: getGraphic(),
        series,
      };
      setHandleOption(option);
      return true;
    } catch (err) {
      return false;
    }
  };
  useEffect(() => {
    getOption();
  }, []);

  useEffect(() => {
    getOption();
  }, [rtPairs]);

  /* 点击某个点复制其肽段名字*/
  echarts?.getEchartsInstance().off('click'); // 防止多次触发
  echarts?.getEchartsInstance().on('click', (params: any) => {
    if (params.componentType === 'series') {
      message.success(`肽段：${params.data[2]}`);
    }
  });

  return (
    <Row>
      <Col span="24">
        <ReactECharts
          ref={(e) => {
            setEcharts(e);
          }}
          option={handleOption}
          style={{ width: '100%', height: Height }}
          lazyUpdate={true}
        />
      </Col>
    </Row>
  );
};

export default RtPairsCharts;
