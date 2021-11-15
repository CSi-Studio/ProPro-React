import React from 'react';
import ReactECharts from 'echarts-for-react';
import ProCard from '@ant-design/pro-card';
import { isEqual, uniqWith, compact } from 'lodash';

const gridNumInRow: number = 3;
const xName: string = '';
const yName: string = '';
const gridHeight: number = 200;
const gridPaddingHeight: number = 105;
const totalPaddingHeight: number = 120;
const gridPaddingWight: number = 5;
const totalPaddingWidth: number = 3;
const titleHeight: number = 75;
const Width: number = 99;

export type IrtChartsProps = {
  values: any;
};

const XicCharts: React.FC<IrtChartsProps> = (props: any) => {
  const intensityKey = props.values.intensityValue.map((value: any) => value.name);
  const gridNumberInRow = props.values.gridNumberInRow;
  const data: any[] = props.values.result;

  // 使legend的每一个和intensity一一对应
  let intMap = data.map((value) => {
    return Object.keys(value.intMap).map((key) => {
      return key;
    });
  });
  intMap = [...new Set([].concat(...intMap))];
  intMap.forEach((item: any) => {
    if (!intensityKey.includes(item)) {
      intensityKey.push(item);
    }
  });

  const Height =
    Math.ceil(props.values.result.length / gridNumberInRow) * (gridHeight + gridPaddingHeight) + 50;

  /* 碎片信息 */
  let allCutMz: any = [];
  data.forEach((item: any) => {
    Object.keys(item.cutInfoMap).forEach((key: any) => {
      allCutMz.push({ name: key, value: item.cutInfoMap[key] });
    });
  });
  // 去重 排序 lodash的方法
  allCutMz = uniqWith(allCutMz, isEqual).sort((a, b) => (a.value > b.value ? -1 : 1));

  const statusFn = (
    value: number,
    str1: any,
    str2: any,
    str3: any,
    str4: any,
    str5?: any,
    str6?: any,
    str7?: any,
  ) => {
    if (value === 0) {
      return str1;
    }
    if (value === 1) {
      return str2;
    }
    if (value === 2) {
      return str3;
    }
    if (value === 3) {
      return str4;
    }
    if (value === 4) {
      return str5;
    }
    if (value === 5) {
      return str6;
    }
    return str7;
  };

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
        backgroundColor: `${statusFn(
          data[i].status,
          '#000',
          'rgba(215,236,184,0.5)',
          'rgba(241,158,156,0.3)',
          'rgba(251,229,154,0.5)',
          'rgba(251,229,154,0.5)',
        )}`,
      };
      grids.push(j);
    }

    return grids;
  };

  // 设置缩放zoom
  const getDataZoom = () => {
    const grids: any = [];
    for (let i = 0; i < data.length; i += 1) {
      const item: any = {
        type: 'inside',
        xAxisIndex: i,
      };
      grids.push(item);
    }
    return grids;
  };

  // 设置表头
  const getXicTitle = () => {
    const titles = [];
    for (let i = 0; i < data.length; i += 1) {
      // rt赋值
      let apexRt: any[] = [];
      if (data[i].peakGroupList) {
        apexRt = data[i].peakGroupList.map((j: any, index: any) => {
          if (index === data[i].selectIndex) {
            return j.apexRt.toFixed(4);
          }
          return false;
        });
        apexRt = apexRt.filter(Boolean);
      }
      const item = {
        text: `${data[i].alias} (${data[i].expId.substring(data[i].expId.length - 5)} - ${data[
          i
        ].overviewId.substring(data[i].overviewId.length - 5)})`,
        height: '200px',
        textAlign: 'center',
        textStyle: {
          color: '#000',
          fontSize: '14',
          fontWeight: 'normal',
          fontFamily: 'Times New Roman,STSong',
        },

        subtext: [
          `{status|${statusFn(
            data[i].status,
            'Unidentified',
            'Success',
            'Fail',
            'LackFragments',
            'LackPeak',
            'NoEIC',
            'Error',
          )}}`,
          `{fdr|${data[i].fdr ? `fdr: ${data[i].fdr.toFixed(4)}` : `fdr: -`}}`,
          `{sum|${data[i].intensitySum ? `sum: ${data[i].intensitySum}` : `sum: -`}}`,
          `{rt|${data[i].peakGroupList !== null ? `rt: ${data[i].apexRt}` : `rt: -`}}`,
        ].join(' '),
        subtextStyle: {
          rich: {
            fdr: {
              color: '#1890ff',
              fontSize: '12',
              fontWeight: 'normal',
              fontFamily: 'Times New Roman,STSong',
              backgroundColor: '#e6f7ff',
              borderColor: '#91d5ff',
              borderWidth: 1,
              borderRadius: 2,
              padding: [3, 3],
            },
            status: {
              color: `${statusFn(
                data[i].status,
                '#0000d9',
                '#389e0d',
                '#ff4d4f',
                '#fb8c00',
                '#fb8c00',
              )}`,
              fontSize: '12',
              fontWeight: 'normal',
              fontFamily: 'Times New Roman,STSong',
              backgroundColor: `${statusFn(
                data[i].status,
                '#eee',
                '#f6ffed',
                '#fff2f0',
                '#fffbe6',
                '#fffbe6',
              )}`,
              borderColor: `${statusFn(
                data[i].status,
                '#777',
                '#b7eb8f',
                '#ffccc7',
                '#ffe58f',
                '#ffe58f',
              )}`,
              borderWidth: 1,
              borderRadius: 2,
              padding: [3, 3],
            },
            sum: {
              color: '#1890ff',
              fontSize: '12',
              fontWeight: 'normal',
              fontFamily: 'Times New Roman,STSong',
              backgroundColor: '#e6f7ff',
              borderColor: '#91d5ff',
              borderWidth: 1,
              borderRadius: 2,
              padding: [3, 3],
            },
            rt: {
              color: '#1890ff',
              fontSize: '12',
              fontWeight: 'normal',
              fontFamily: 'Times New Roman,STSong',
              backgroundColor: '#e6f7ff',
              borderColor: '#91d5ff',
              borderWidth: 1,
              borderRadius: 2,
              padding: [3, 3],
            },
          },
        },
        padding: 0,
        left: `${
          (i % gridNumInRow) * Math.floor(Width / gridNumInRow) +
          Math.floor((Math.floor(Width / gridNumInRow) - gridPaddingWight) / 2) +
          totalPaddingWidth
        }%`,
        top: `${
          (gridHeight + gridPaddingHeight) * Math.floor(i / gridNumInRow) +
          totalPaddingHeight -
          titleHeight
        }px`,
      };
      titles.push(item);
    }
    return titles;
  };

  // 设置x轴
  const getXicxAxis = (count: number, axisName: string) => {
    const xAxis = [];
    const min = Math.floor(
      Math.min(
        ...data?.map((item: { rtArray: any }) => {
          return Math.min(...item.rtArray);
        }),
      ),
    );
    const max = Math.ceil(
      Math.max(
        ...data?.map((item: { rtArray: any }) => {
          return Math.max(...item.rtArray);
        }),
      ),
    );
    for (let i = 0; i < count; i += 1) {
      xAxis.push({
        gridIndex: i,
        name: axisName,
        splitLine: {
          show: false,
        },
        nameLocation: 'end',
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
        min,
        max,
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
        nameLocation: 'end',
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

  // 设置标注区域
  const getMarkArea = (value: { peakGroupList: { leftRt: number, rightRt: number }[]; selectIndex: number }) => {
    if (!value.peakGroupList) {
      return null;
    }
    const markAreaOpt: any = {
      animation: false,
      data: [],
    };
    value.peakGroupList.forEach((item: { leftRt: number, rightRt: number }, index) => {
     
      markAreaOpt.data.push([
        {
          xAxis: item.leftRt,
          itemStyle: { color: value.selectIndex === index ? '#AAE68A' : 'rgba(256,256,256,0.3)' },
        },
        {
          xAxis: item.rightRt,
          itemStyle: { color: value.selectIndex === index ? '#AAE68A' : 'rgba(256,256,256,0.3)' },
        },
      ]);
    });

    return markAreaOpt;
  };

  // 设置标注线
  const getMarkLine = (value: { peakGroupList: any[]; selectIndex: any }) => {
    if (!value.peakGroupList) {
      return null;
    }
    const markLineOpt: any = {
      symbol: ['none', 'none'],
      animation: false,
      lineStyle: {
        type: 'dashed',
        color: '#777',
      },
      emphasis: {
        lineStyle: {
          type: 'solid',
          color: 'tomato',
          width: 2,
        },
      },
      // silent: true, // 图形是不响应和触发鼠标事件
      label: { show: false },
      data: [],
    };

    value.peakGroupList.forEach((item: any) => {
      markLineOpt.data.push({
        xAxis: item.selectedRt,
        lineStyle: { color: '#316EC8', type: 'dotted', dashOffset: 2, width: 1 },
      });
    });

    return markLineOpt;
  };

  // 设置图表数据格式
  const getSeriesData = (xdata: [], ydata: []) => {
    const sData: any[][] = [];
    const length = Math.min(xdata.length);

    for (let i = 0; i < length; i += 1) {
      if (ydata && xdata) {
        sData.push([xdata[i], ydata[i]]);
      }
    }
    return sData;
  };

  // 设置图表样式
  const getXicSeries = () => {
    const series: Record<any, any>[] = [];
    for (let i = 0; i < data.length; i += 1) {
      if (
        data[i].rtArray == null ||
        data[i].rtArray === undefined ||
        data[i].rtArray.length === 0
      ) {
        return null;
      }
      intensityKey.forEach((key: string) => {
        const seriesItem = {
          type: 'line',
          showSymbol: false,
          xAxisIndex: i,
          yAxisIndex: i,
          name: key,
          lineStyle: {
            width: 1,
          },
          data: getSeriesData(data[i].rtArray, data[i].intMap[key]),
          emphasis: {
            lineStyle: {
              width: 1,
            },
            focus: 'series',
          },
          markLine: getMarkLine(data[i]),
          markArea: getMarkArea(data[i]),
        };
        series.push(seriesItem);
      });
    }
    return series;
  };

  // 设置legend
  const getXicLegend = () => {
    const legends: any = [
      {
        data: allCutMz.map((item: { name: string }) => {
          return item.name;
        }),
        right: '6%',
        width: '100%',
        top: `${6}px`,
        padding: 0,
        type: 'scroll',
        icon: 'none',
        itemGap: 0,
        itemWidth: 5,
        selector: true,
        textStyle: {
          fontSize: '14',
          color: '#fff',
          padding: 5,
          borderRadius: 5,
          fontFamily: 'Times New Roman,STSong',
          backgroundColor: [
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
        },
        formatter(name: any) {
          let mzValue = allCutMz.map((item: any) => {
            if (item.name === name) {
              return item.value;
            }
          });
          // 取出 undefined 项
          mzValue = compact(mzValue);
          return `${name}:${mzValue[0] ? mzValue[0] : 0}`;
        },
      },
    ];
    for (let i = 0; i < data.length; i += 1) {
      // rt赋值
      const keyName: any = [];
      let singleCutMz: any = [];
      Object.keys(data[i].cutInfoMap).forEach((key: any) => {
        singleCutMz.push({ name: key, value: data[i].cutInfoMap[key] });
      });
      singleCutMz = uniqWith(singleCutMz, isEqual).sort((a, b) => (a.value > b.value ? -1 : 1));
      singleCutMz.forEach((item: { name: string }) => {
        keyName.push(item.name);
      });

      const item = {
        data: keyName,
        right: '8%',
        width: '30%',
        type: 'scroll',
        icon: 'none',
        itemGap: 0,
        itemWidth: 5,
        textStyle: {
          fontSize: '12',
          color: '#fff',
          padding: 5,
          borderRadius: 5,
          fontFamily: 'Times New Roman,STSong',
          backgroundColor: [
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
        },
        padding: 0,
        left: `${
          (i % gridNumInRow) * Math.floor(Width / gridNumInRow) +
          Math.floor((Math.floor(Width / gridNumInRow) - gridPaddingWight) / 2) +
          totalPaddingWidth -
          14
        }%`,
        top: `${
          (gridHeight + gridPaddingHeight) * Math.floor(i / gridNumInRow) +
          totalPaddingHeight -
          titleHeight +
          50
        }px`,
      };
      legends.push(item);
    }
    return legends;
  };

  // 设置option
  const getXicOption = () => {
    const gridNumber = data.length;
    function chartsFn(params: any) {
      props.values.spectraFn(params);
    }
    window.chartsFn = chartsFn;
    return {
      title: getXicTitle(),
      dataZoom: getDataZoom(),
      grid: getXicGrids(gridNumber),
      tooltip: {
        enterable: true,
        confine: true,
        trigger: 'axis',
        extraCssText: 'z-index: 2',
        position(pos: number[]) {
          return [pos[0] + 5, pos[1] + 10];
        },
        alwaysShowContent: false,
        textStyle: {
          color: '#000',
          fontSize: '14',
          fontWeight: 'normal',
          fontFamily: 'Times New Roman,STSong',
        },
        backgroundColor: ['rgba(255,255,255,0.8)'],
        formatter: (params: any) => {
          params.sort((a: { data: number[] }, b: { data: number[] }) => {
            return b.data[1] - a.data[1];
          });
          window.paramsTool = params;

          let html = `<div  id="specialLook" style="pointer-events: all;"
          onclick="
            chartsFn(paramsTool);
          " 
          >查看光谱图</div>${params[0].axisValue}<br />`;
          params.forEach((item: any) => {
            html += `${item.marker}<span style="display:inline-block;margin-right:4px;width:30px">${item.seriesName}</span>&nbsp&nbsp&nbsp <span style="font-weight:bold">${item.data[1]}</span><br />`;
          });

          return html;
        },
      },
      xAxis: getXicxAxis(gridNumber, xName),
      yAxis: getXicyAxis(gridNumber, yName),
      series: getXicSeries(),
      color: [
        '#1890ff',
        'orange',
        'hotpink',
        '#3CB371',
        '#9370D8',
        'tomato',
        '#71d8d2',
        '#d68022',
        '#6C97D7',
        '#F4B397',
        '#395165',
        '#F2DF5D',
      ],
      toolbox: {
        feature: {
          restore: {},
          dataView: {},
          saveAsImage: {},
        },
      },
      animation: false,
      legend: getXicLegend(),
    };
  };

  return (
    <ProCard>
      <ReactECharts
        option={getXicOption()}
        style={{ width: `100%`, height: Height }}
        lazyUpdate={true}
      />
    </ProCard>
  );
};

export default XicCharts;
