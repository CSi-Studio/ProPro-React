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
    xName: string = ``,
    yName: string = ``,
    gridHeight: number = 160,
    gridPaddingHeight: number = 80,
    totalPaddingHeight: number = 20,
    gridPaddingWight: number = 5,
    totalPaddingWidth: number = 5,
    titleHeight: number = 20,
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
      grid: this.getIrtGrids(gridNumber),
      tooltip: {
        formatter: `${this.xName} , ${this.yName}<br>{c}`,
      },
      xAxis: this.getIrtAxis(gridNumber, true, this.xName),
      yAxis: this.getIrtAxis(gridNumber, false, this.yName),
      series: this.getIrtSeries(this.data),
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

  private getIrtTitle(data: any) {
    const titles = [];
    for (let i = 0; i < data.length; i += 1) {
      const item = {
        // text: data[i].peptideRef,
        textAlign: 'left',
        textStyle: {
          fontSize: '14',
          fontFamily: 'Times New Roman',
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

  private getIrtAxis(count: number, scaleTag: boolean, axisName: string) {
    const Axis = [];
    for (let i = 0; i < count; i += 1) {
      Axis.push({
        gridIndex: i,
        scale: scaleTag,
        name: axisName,
        nameLocation: 'start',
        axisLabel: {
          show: true,
          textStyle: {
            fontFamily: 'Times New Roman',
            fontWeight: 'normal',
          },
        },
        nameTextStyle: { padding: 10, fontSize: '12', fontFamily: 'Times New Roman' },
      });
    }
    return Axis;
  }

  private getIrtSeries(data: any[]) {
    const series = [];
    for (let i = 0; i < data.length; i += 1) {
      if (
        data[i].rtArray == null ||
        data[i].rtArray === undefined ||
        data[i].rtArray.length === 0
      ) {
        return null;
      }
      const seriesItem: Record<any, any> = {
        type: 'line',
        showSymbol: false,
        xAxisIndex: i,
        yAxisIndex: i,
        // data: [],
        // markLine: this.getMarkLine(
        //   data[i].irt.selected.y,
        //   data[i].irt.si.slope,
        //   data[i].irt.si.intercept,
        //   data[i].irt.si.formula,
        // ),
      };
      Object.keys(data[i].intMap).forEach((key) => {
        let seriesItem = {
          type: 'line',
          showSymbol: false,
          xAxisIndex: i,
          yAxisIndex: i,
          data: this.getSeriesData(data[i].rtArray, data[i].intMap[key]),
          // data: [],
          // markLine: this.getMarkLine(
          //   data[i].irt.selected.y,
          //   data[i].irt.si.slope,
          //   data[i].irt.si.intercept,
          //   data[i].irt.si.formula,
          // ),
        };
        series.push(seriesItem);
      });
      console.log(seriesItem.data);

      // seriesItem = {
      //   type: 'line',
      //   showSymbol: false,
      //   xAxisIndex: i,
      //   yAxisIndex: i,
      //   color: '#f00',
      //   data: this.getSeriesData(data[i].rtArray, data[i].intMap),
      //   // markLine: null,
      // };
      // series.push(seriesItem);
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

  private getMarkLine(data: number[], slope: number, intercept: number, formula: string) {
    if (data.length === 0) {
      return null;
    }
    const markLineOpt = {
      animation: false,
      silent: true,
      label: {
        formatter: formula,
        align: 'right',
        fontFamily: 'Times New Roman',
      },
      lineStyle: {
        type: 'solid',
      },
      tooltip: {
        formatter: formula,
        axisPointer: {
          label: {
            fontFamily: 'Times New Roman',
          },
        },
      },
      data: [
        [
          {
            coord: [Math.min(...data) * slope + intercept, Math.min(...data)],
            symbol: 'none',
          },
          {
            coord: [Math.max(...data) * slope + intercept, Math.max(...data)],
            symbol: 'none',
          },
        ],
      ],
    };
    return markLineOpt;
  }
}
