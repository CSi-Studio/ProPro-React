/* eslint-disable no-nested-ternary */
export default (values: { result: any[]; getCutInfo: Record<any, any>; spectraFn: any }) => {
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

  /* 碎片信息 */
  const allCutInfo: any = [];
  const allCutMz: any = {};
  data.forEach((item: any) => {
    Object.keys(item.cutInfoMap).forEach((key: any) => {
      allCutMz[key] = item.cutInfoMap[key];
      // allCutMz.push(`${key}:${item.cutInfoMap[key]}`);
      allCutInfo.push(key);
    });
  });
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
          'rgba(215,236,184)',
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
    const titles = [
      {
        text: `${data[0].peptideRef} - ${[...new Set([].concat(...allCutInfo))].length}个碎片`,
        height: '200px',
        textAlign: 'left',
        textStyle: {
          color: '#000',
          fontSize: '15',
          fontWeight: 'normal',
          fontFamily: 'Times New Roman,STSong',
        },
        padding: 0,
        top: `${10}px`,
        left: '4%',
      },
    ];
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
        text: data[i].alias,
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
            '尚未鉴定',
            '鉴定成功',
            '鉴定失败',
            '碎片不足',
            '缺少峰组',
            'EIC为空',
            '未知错误',
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
          itemStyle: { color: value.selectIndex === index ? '#AAE68A' : '#eee' },
        },
        {
          xAxis: rtRange[1],
          itemStyle: { color: value.selectIndex === index ? '#AAE68A' : '#eee' },
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

    value.scoreList.forEach((item: any, index: any) => {
      if (index === value.selectIndex) {
        markLineOpt.data.push({
          xAxis: item.rt,
          lineStyle: { color: '#316EC8', type: 'dotted', dashOffset: 2, width: 1 },
        });
      } else {
        markLineOpt.data.push({
          xAxis: item.rt,
          lineStyle: { color: '#316EC8', type: 'dotted', dashOffset: 2, width: 1 },
        });
      }
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
        data: [...new Set([].concat(...allCutInfo))],
        right: '6%',
        width: '77%',
        top: `${6}px`,
        padding: 0,
        type: 'scroll',
        icon: 'none',
        itemGap: 0,
        itemWidth: 5,
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
          return `${name}：${allCutMz[name]}`;
        },
      },
    ];
    for (let i = 0; i < data.length; i += 1) {
      // rt赋值
      const keyName: any = [];
      Object.keys(data[i].intMap).forEach((key) => {
        keyName.push({ name: key });
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
  const getXicOption = (getCutInfo: Record<any, any>) => {
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
        alwaysShowContent: true,
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
        'hotpink',
        '#3CB371',
        'orange',
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
          myTool1: {
            show: true,
            title: '碎片m/z',
            icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
            onclick: getCutInfo,
          },
          restore: {},
          dataView: {},
          saveAsImage: {},
        },
      },
      animation: false,
      legend: getXicLegend(),
    };
  };
  return getXicOption(values.getCutInfo);
};
