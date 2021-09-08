/* eslint-disable no-nested-ternary */
export class IrtOption {
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
    gridPaddingWight: number = 4,
    totalPaddingWidth: number = 2.4,
    titleHeight: number = 50,
    Width: number = 100,
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

  getWidth(): string {
    return `${this.Width}`;
  }

  getIrtOption(): any {
    const gridNumber = this.data.length;
    return {
      title: this.getIrtTitle(this.data),
      dataZoom: this.getDataZoom(this.data),
      grid: this.getIrtGrids(gridNumber),
      tooltip: {
        trigger: 'axis',
        textStyle: {
          color: '#000',
          fontSize: '14',
          fontWeight: 'normal',
          fontFamily: 'Times New Roman,STSong',
        },
      },
      xAxis: this.getIrtxAxis(gridNumber, this.xName, this.data),
      yAxis: this.getIrtyAxis(gridNumber, this.yName),
      series: this.getIrtSeries(this.data),
      color: [
        '#1890ff',
        'lightsalmon',
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
          dataZoom: {
            yAxisIndex: 'none',
          },
          restore: {},
          saveAsImage: {},
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
        // inactiveColor: 'tomato',
        textStyle: {
          fontSize: '14',
          color: '#fff',
          // fontWeight: 'bold',
          padding: 5,
          borderRadius: 5,
          fontFamily: 'Times New Roman,STSong',
          backgroundColor: [
            '#1890ff',
            'lightsalmon',
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

  private getIrtGrids(count: number) {
    const grids: any = [];
    for (let i: number = 0; i < count; i += 1) {
      const item: any = {
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
      };
      grids.push(item);
    }
    return grids;
  }
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

  private getIrtTitle(data: any) {
    const titles = [];
    for (let i = 0; i < data.length; i += 1) {
      const item = {
        text: data[i].name,
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
          `{fdr|${data[i].fdr ? `fdr: ${data[i].fdr.toFixed(4)}` : ``}}`,
          `{sum|${data[i].sum ? `sum: ${data[i].sum}` : ``}}`,
        ].join(' '),
        subtextStyle: {
          rich: {
            fdr: {
              color: `${data[i].fdr ? '#1890ff' : ''}`,
              fontSize: '12',
              fontWeight: 'normal',
              fontFamily: 'Times New Roman,STSong',
              backgroundColor: `${data[i].fdr ? '#e6f7ff' : ''}`,
              borderColor: `${data[i].fdr ? '#91d5ff' : ''}`,
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
              color: `${data[i].fdr ? '#1890ff' : ''}`,
              fontSize: '12',
              fontWeight: 'normal',
              fontFamily: 'Times New Roman,STSong',
              backgroundColor: `${data[i].fdr ? '#e6f7ff' : ''}`,
              borderColor: `${data[i].fdr ? '#91d5ff' : ''}`,
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

  private getIrtxAxis(count: number, axisName: string, data: any) {
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
  private getIrtyAxis(count: number, axisName: string) {
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

  private getIrtSeries(data: any[]) {
    console.log('data----', data);
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
          },
          markLine: this.getMarkLine(data[i]),
          areaStyle: {},
        };
        series.push(seriesItem);
      });
    }
    return series;
  }

  private getSeriesData(xdata: [], ydata: []) {
    const result: any[][] = [];
    const length = Math.min(xdata.length);
    for (let i = 0; i < length; i += 1) {
      result.push([xdata[i], ydata[i]]);
    }
    return result;
  }

  private getMarkLine(data: any) {
    if (!data.scoreList) {
      return null;
    }
    const markLineOpt = {
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
      tooltip: {
        // formatter: formula,
        axisPointer: {
          label: {
            fontFamily: 'Times New Roman,STSong',
          },
        },
      },
      label: { show: false },
      data: [],
    };
    data.scoreList.forEach((item: any, index: any) => {
      if (index === data.selectIndex) {
        const rtData = item.rtRangeFeature.split(';');
        markLineOpt.data.push({
          xAxis: rtData[0],
          lineStyle: { color: '#FF1D00', type: 'dashed', width: 1 },
        });
        markLineOpt.data.push({
          xAxis: rtData[1],
          lineStyle: { color: '#FF1D00', type: 'dashed', width: 1 },
        });
      } else {
        const rtData = item.rtRangeFeature.split(';');
        markLineOpt.data.push({ xAxis: rtData[0] });
        markLineOpt.data.push({ xAxis: rtData[1] });
      }
    });

    return markLineOpt;
  }
}
