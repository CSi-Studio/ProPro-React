import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Col, Empty, Row, Spin } from 'antd';

export type PeptideDisProps = {
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

const PeptideDis: React.FC<PeptideDisProps> = (props: any) => {
  const [handleOption, setHandleOption] = useState({});
  const { values } = props;

  const Height =
    Math.ceil(props.values.runData.length / gridNumInRow) * (gridHeight + gridPaddingHeight);

  useEffect(() => {
    if (values.runData.length > 0) {
      const getMarkLine = () => {
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
          data: [{ xAxis: 10 }],
          tooltip: {
            show: false,
          },
        };
        return markLineOpt;
      };

      /* 设置series */
      const series: any[] = [];
      const seriesData: any = [];

      Object.keys(values.prepareData.overviewMap).forEach((key) => {
        values.prepareData.overviewMap[key].forEach((item: any) => {
          if (item.defaultOne) {
            const dataInit: any = {
              decoy: [],
              target: [],
              alias: '',
            };
            const decoyData: any = [];
            const targetData: any = [];
            values.runData.forEach((_item: { runId: string; alias: string }) => {
              if (_item.runId === key) {
                dataInit.alias = _item.alias;
                if (item?.statistic?.DECOY_DIST) {
                  Object.keys(item?.statistic?.DECOY_DIST)?.forEach((inKey: any) => {
                    decoyData.push(item?.statistic?.DECOY_DIST[inKey]);
                    dataInit.decoy.push({
                      value: inKey.replace(/_/g, '.').split('-'),
                      data: decoyData,
                    });
                  });
                  Object.keys(item?.statistic?.TARGET_DIST).forEach((inKey: any) => {
                    targetData.push(item?.statistic?.TARGET_DIST[inKey]);
                    dataInit.target.push({
                      value: inKey.replace(/_/g, '.').split('-'),
                      data: targetData,
                    });
                  });
                }
              }
            });
            dataInit.decoy.sort(
              (a: { value: number }, b: { value: number }) => a.value[0] - b.value[0],
            );
            dataInit.target.sort(
              (a: { value: number }, b: { value: number }) => a.value[0] - b.value[0],
            );
            seriesData.push(dataInit);
          }
        });
      });
      seriesData.sort((a: { alias: any }, b: { alias: any }) => (a.alias > b.alias ? 1 : -1));

      seriesData.forEach((item: any, idx: any) => {
        series.push(
          // {
          //   xAxisIndex: idx,
          //   yAxisIndex: idx,
          //   type: 'bar',
          //   name: 'decoy',
          //   symbolSize: 2,
          //   animation: false,
          //   data: item?.decoy[0]?.data,
          //   large: true,
          //   markLine: getMarkLine(),
          // },
          // {
          //   xAxisIndex: idx,
          //   yAxisIndex: idx,
          //   type: 'bar',
          //   name: 'target',
          //   symbolSize: 2,
          //   animation: false,
          //   data: item?.target[0]?.data,
          //   large: true,
          // },
          {
            name: 'decoy',
            type: 'line',
            xAxisIndex: idx,
            yAxisIndex: idx,
            data: item?.decoy[0]?.data,
            markLine: getMarkLine(),
          },
          {
            name: 'target',
            type: 'line',
            xAxisIndex: idx,
            yAxisIndex: idx,
            data: item?.target[0]?.data,
          },
        );
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
          };
          grids.push(j);
        }
        return grids;
      };

      // 设置表头
      const getXicTitle = () => {
        const titles: any[] = [];
        seriesData.forEach((item: { alias: any }, idx: number) => {
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
        for (let i = 0; i < props.values.runData.length; i += 1) {
          const item: any = {
            type: 'inside',
            xAxisIndex: i,
          };
          grids.push(item);
        }
        return grids;
      };

      // 设置x轴
      const getXicxAxis = (data: any, axisName: string) => {
        const xAxis = [];
        for (let i = 0; i < data.length; i += 1) {
          xAxis.push({
            gridIndex: i,
            name: axisName,
            type: 'category',
            splitLine: {
              show: false,
            },
            data: data[0].decoy.map((item: any) => {
              if (item.value[1]) {
                return `${item.value[0]}-${item.value[1]}`;
              }
              return item.value[0];
            }),
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
        xAxis: getXicxAxis(seriesData, xName),
        yAxis: getXicyAxis(seriesData.length, yName),
        animation: false,
        toolbox: {
          feature: {
            restore: {},
            dataView: {},
            saveAsImage: {},
          },
        },
        legend: {},
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
        dataZoom: getDataZoom(),
        series,
      };
      setHandleOption(option);
    }
  }, [props.values.runData.length, values]);

  return (
    <Row>
      <Col span="24">
        <Spin spinning={!props.values.runData.length}>
          {props.values.runData.length > 0 ? (
            <ReactECharts
              option={handleOption}
              style={{ width: '100%', height: Height }}
              lazyUpdate={true}
            />
          ) : (
            <Empty
              description="Loading..."
              style={{ padding: '10px', color: '#B0B8C1' }}
              imageStyle={{ padding: '20px 0 0 0', height: '140px' }}
            />
          )}
        </Spin>
      </Col>
    </Row>
  );
};

export default PeptideDis;
