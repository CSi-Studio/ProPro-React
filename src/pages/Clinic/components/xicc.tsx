/* eslint-disable no-nested-ternary */
import { isEqual, uniqWith, compact } from 'lodash';

export default (values: { result: any[]; spectraFn: any }) => {
  const data: any[] = values.result;
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
  console.log('XICspectraFn', values.spectraFn);

  /* 碎片信息 */
  let allCutMz: any = [];

  data.forEach((item: any) => {
    Object.keys(item.cutInfoMap).forEach((key: any) => {
      allCutMz.push({ name: key, value: item.cutInfoMap[key] });
    });
  });
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
      let rt: any[] = [];
      if (data[i].scoreList) {
        rt = data[i].scoreList.map((j: any, index: any) => {
          if (index === data[i].selectIndex) {
            return j.rt.toFixed(4);
          }
          return false;
        });
        rt = rt.filter(Boolean);
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
          `{sum|${data[i].sum ? `sum: ${data[i].sum}` : `sum: -`}}`,
          `{rt|${data[i].scoreList !== null ? `rt: ${rt}` : `rt: -`}}`,
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
  const getMarkArea = (value: { scoreList: { rtRangeFeature: string }[]; selectIndex: number }) => {
    if (!value.scoreList) {
      return null;
    }
    const markAreaOpt: any = {
      animation: false,
      data: [],
    };
    value.scoreList.forEach((item: { rtRangeFeature: string }, index) => {
      const rtRange = item.rtRangeFeature.split(';');
      markAreaOpt.data.push([
        {
          xAxis: rtRange[0],
          itemStyle: { color: value.selectIndex === index ? '#AAE68A' : 'rgba(256,256,256,0.3)' },
        },
        {
          xAxis: rtRange[1],
          itemStyle: { color: value.selectIndex === index ? '#AAE68A' : 'rgba(256,256,256,0.3)' },
        },
      ]);
    });

    return markAreaOpt;
  };

  // 设置标注线
  const getMarkLine = (value: { scoreList: any[]; selectIndex: any }) => {
    if (!value.scoreList) {
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

    value.scoreList.forEach((item: any) => {
      markLineOpt.data.push({
        xAxis: item.nearestRt,
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
      sData.push([xdata[i], ydata[i]]);
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
      Object.keys(data[i].intMap).forEach((key) => {
        // console.log(data[i].intMap, key);
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
  // console.log(
  //   '213',
  //   allCutMz.map((item: { name: string }) => {
  //     return item.name;
  //   }),
  // );

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
          let a = allCutMz.map((item: any) => {
            if (item.name === name) {
              return item.value;
            }
          });
          a = compact(a);
          return `${name}:${a[0] ? a[0] : 0}`;
        },
      },
    ];
    for (let i = 0; i < data.length; i += 1) {
      // rt赋值
      const keyName: any = [];
      Object.keys(data[i].intMap).forEach((key) => {
        keyName.push(key);
      });
      // console.log(data);
      // console.log(keyName);
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
      values.spectraFn(params);
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
          let html = `<div  id="specialLook" style="pointer-events: all;" onclick="
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
  return getXicOption();
};