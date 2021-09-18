/* eslint-disable no-nested-ternary */
export class XicOption {
  private data: any[]; // 点数据数组
  private gridNumInRow: number; // 每行grid数量
  private gridHeight: number; // grid高度
  private gridPaddingHeight: number; // grid高度下缩进（行距）
  private gridPaddingWight: number; // grid宽度右缩进
  private totalPaddingHeight: number; // 整体高度上缩进
  private totalPaddingWidth: number; // 整体宽度左缩进,值小于gridPaddingWight
  private titleHeight: number; //  标题高度
  private Width: number; // 总宽度
  private xName: string;
  private yName: string;

  // constructor：构造函数，在实例化对象的时候执行
  constructor(
    data: any[],
    gridNumInRow: number = 3,
    xName: string = '',
    yName: string = '',
    gridHeight: number = 200,
    gridPaddingHeight: number = 80,
    totalPaddingHeight: number = 90,
    gridPaddingWight: number = 5,
    totalPaddingWidth: number = 3,
    titleHeight: number = 50,
    Width: number = 99,
  ) {
    this.data = data;
    this.gridNumInRow = gridNumInRow;
    this.gridHeight = gridHeight;
    this.gridPaddingHeight = gridPaddingHeight;
    this.gridPaddingWight = gridPaddingWight;
    this.totalPaddingHeight = totalPaddingHeight;
    this.totalPaddingWidth = totalPaddingWidth;
    this.titleHeight = titleHeight;
    this.Width = Width;
    this.xName = xName;
    this.yName = yName;
  }

  // 设置option
  getXicOption(getCutInfo: Record<any, any>): any {
    const gridNumber = this.data.length;
    return {
      title: this.getXicTitle(this.data),
      dataZoom: this.getDataZoom(this.data),
      grid: this.getXicGrids(gridNumber, this.data),
      tooltip: {
        trigger: 'axis',
        // triggerOn: 'click',
        axisPointer: {
          snap: true,
        },
        textStyle: {
          color: '#000',
          fontSize: '14',
          fontWeight: 'normal',
          fontFamily: 'Times New Roman,STSong',
        },
        formatter: (params: any) => {
          console.log(
            params.map((item: any) => {
              return item.data[1];
            }),
          );
          console.log(params);
          let a = `${params[0].axisValue}<br /><br />`;
          params.forEach((item: any) => {
            a += `${item.marker}<span style=\"display:inline-block;margin-right:4px;width:30px\">${item.seriesName}</span>&nbsp&nbsp&nbsp <span style=\"font-weight:bold\">${item.data[1]}</span><br />`;
          });
          return a;
        },
      },
      xAxis: this.getXicxAxis(gridNumber, this.xName, this.data),
      yAxis: this.getXicyAxis(gridNumber, this.yName),
      series: this.getXicSeries(this.data),
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
      toolbox: {
        feature: {
          restore: {},
          dataView: {},
          saveAsImage: {},
          myTool1: {
            show: true,
            title: '碎片Mz',
            icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
            onclick: getCutInfo,
          },
        },
      },
      animation: false,
      legend: {
        right: '8%',
        width: '700px',
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
      },
    };
  }

  // 设置Grids布局
  private getXicGrids(count: number, data: any) {
    const grids: any = [];

    for (let i: number = 0; i < count; i += 1) {
      const j: any = {
        left: `${
          (i % this.gridNumInRow) * Math.floor(this.Width / this.gridNumInRow) +
          this.totalPaddingWidth
        }%`,
        top: `${
          (this.gridHeight + this.gridPaddingHeight) * Math.floor(i / this.gridNumInRow) +
          this.totalPaddingHeight
        }px`,
        width: `${Math.floor(this.Width / this.gridNumInRow) - this.gridPaddingWight}%`,
        height: `${this.gridHeight}px`,
        show: 'true',
        backgroundColor: `${
          data[i].status === 0
            ? '#000'
            : data[i].status === 1
            ? 'rgba(215,236,184)'
            : data[i].status === 2
            ? 'rgba(241,158,156,0.3)'
            : data[i].status === 3
            ? 'rgba(251,229,154,0.5)'
            : 'rgba(251,229,154,0.5)'
        }`,
      };
      grids.push(j);
    }

    return grids;
  }
  // 设置缩放zoom
  private getDataZoom(data: any) {
    const grids: any = [];
    for (let i = 0; i < data.length; i += 1) {
      const item: any = {
        type: 'inside',
        xAxisIndex: i,
      };
      grids.push(item);
    }
    return grids;
  }
  // 设置表头
  private getXicTitle(data: any) {
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
          `{status|${
            data[i].status === 0
              ? '尚未鉴定'
              : data[i].status === 1
              ? '鉴定成功'
              : data[i].status === 2
              ? '鉴定失败'
              : data[i].status === 3
              ? '条件不足'
              : '缺少峰组'
          }}`,
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
              color: `${
                data[i].status === 0
                  ? '#000000d9'
                  : data[i].status === 1
                  ? '#389e0d'
                  : data[i].status === 2
                  ? '#ff4d4f'
                  : '#fb8c00'
              }`,
              fontSize: '12',
              fontWeight: 'normal',
              fontFamily: 'Times New Roman,STSong',
              backgroundColor: `${
                data[i].status === 0
                  ? '#eee'
                  : data[i].status === 1
                  ? '#f6ffed'
                  : data[i].status === 2
                  ? '#fff2f0'
                  : '#fffbe6'
              }`,
              borderColor: `${
                data[i].status === 0
                  ? '#777'
                  : data[i].status === 1
                  ? '#b7eb8f'
                  : data[i].status === 2
                  ? '#ffccc7'
                  : '#ffe58f'
              }`,
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
          (i % this.gridNumInRow) * Math.floor(this.Width / this.gridNumInRow) +
          Math.floor((Math.floor(this.Width / this.gridNumInRow) - this.gridPaddingWight) / 2) +
          this.totalPaddingWidth
        }%`,
        top: `${
          (this.gridHeight + this.gridPaddingHeight) * Math.floor(i / this.gridNumInRow) +
          this.totalPaddingHeight -
          this.titleHeight
        }px`,
      };
      titles.push(item);
    }
    return titles;
  }

  // 设置x轴
  private getXicxAxis(count: number, axisName: string, data: any) {
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
  }
  // 设置y轴
  private getXicyAxis(count: number, axisName: string) {
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
  }

  // 设置图表样式
  private getXicSeries(data: any[]) {
    const series: Record<any, any>[] = [];
    const cutInfo: string[] = [];
    Object.keys(data[0].cutInfoMap).forEach((key) => {
      cutInfo.push(key);
    });
    for (let i = 0; i < data.length; i += 1) {
      if (
        data[i].rtArray == null ||
        data[i].rtArray === undefined ||
        data[i].rtArray.length === 0
      ) {
        return null;
      }
      Object.keys(data[i].intMap).forEach((key, index) => {
        const seriesItem = {
          type: 'line',
          showSymbol: false,
          xAxisIndex: i,
          yAxisIndex: i,
          name: cutInfo[index],
          lineStyle: {
            width: 1,
          },
          data: this.getSeriesData(data[i].rtArray, data[i].intMap[key]),
          emphasis: {
            lineStyle: {
              width: 1,
            },
            focus: 'series',
          },
          // tooltip: {
          //   trigger: 'axis',
          //   triggerOn: 'click',
          //   axisPointer: {
          //     snap: true,
          //   },
          //   formatter: (params: any) => {
          //     // console.log(
          //     //   params.map((item: any) => {
          //     //     return item.data[1];
          //     //   }),
          //     // );
          //     console.log(params);
          //   },
          // },
          markLine: this.getMarkLine(data[i]),
          markArea: this.getMarkArea(data[i]),
        };
        series.push(seriesItem);
      });
    }
    return series;
  }
  // 设置图表数据格式
  private getSeriesData(xdata: [], ydata: []) {
    const result: any[][] = [];
    const length = Math.min(xdata.length);
    for (let i = 0; i < length; i += 1) {
      result.push([xdata[i], ydata[i]]);
    }
    return result;
  }
  // 设置标注线
  private getMarkLine(data: any) {
    if (!data.scoreList) {
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

    data.scoreList.forEach((item: any, index: any) => {
      if (index === data.selectIndex) {
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
  }
  // 设置标注区域
  private getMarkArea(data: any) {
    if (!data.scoreList) {
      return null;
    }
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
      itemStyle: { color: '#eee' },
      data: [],
    };

    data.scoreList.forEach((item: any, index: any) => {
      const rtRange = item.rtRangeFeature.split(';');
      markAreaOpt.data.push([
        {
          xAxis: rtRange[0],
        },
        {
          xAxis: rtRange[1],
        },
      ]);
    });

    return markAreaOpt;
  }
}
