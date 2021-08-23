import * as ecStat from "echarts-stat";

export class IrtOption {
    private data: any[]; // 点数据数组
    private ydata: any[]; // 点数据数组
    private titles: any[]; // 标题数组
    private num: number; // 每行grid数量
    private gridHeight: number; // grid高度
    private gridPaddingHeight: number; // grid高度下缩进（行距）
    private gridPaddingWight: number; // grid宽度右缩进
    private totalPaddingHeight: number; // 整体高度上缩进
    private totalPaddingWidth: number; // 整体宽度左缩进,值小于gridPaddingWight
    private titleHeight: number; //  标题高度
    private Width: number; // 总宽度
    // constructor：构造函数，在实例化对象的时候执行
    constructor(data: any[], titles: any[],num: number = 5, gridHeight: number = 23,gridPaddingHeight: number = 8,gridPaddingWight: number = 6,
      totalPaddingHeight: number = 5,totalPaddingWidth: number = 3,titleHeight: number = 3,Width: number = 100) {
      this.data = data;
      this.titles = titles;
      this.num = num;
      this.gridHeight = gridHeight;
      this.gridPaddingHeight = gridPaddingHeight;
      this.gridPaddingWight = gridPaddingWight;
      this.totalPaddingHeight = totalPaddingHeight;
      this.totalPaddingWidth = totalPaddingWidth;
      this.titleHeight = titleHeight;
      this.Width = Width;
      this.ydata = [];
    }
  
    getWidth(): string {
      return `${this.Width}`;
    }
  
    getIrtOption(): any  {
      return {
        title: this.getIrtTitle(this.titles),
        grid: this.getIrtGrids(this.data.length),
        tooltip: {
          formatter: "Group : ({c})"
        },
        xAxis: this.getIrtAxis(this.data.length, true),
        yAxis: this.getIrtAxis(this.data.length, false),
        series: this.getIrtSeries(this.data)
      };
    }
    
    private getIrtGrids(count: number) {
      const grids: any = [];
      for (let i: number = 0; i < count; i += 1) {
        const item: any = {
          left: `${(i % this.num) * Math.floor(this.Width / this.num) + this.totalPaddingWidth}%`,
          top: `${this.gridHeight * Math.floor(i / this.num) + this.totalPaddingHeight}%`,
          width: `${Math.floor(this.Width / this.num) - this.gridPaddingWight}%`,
          height: `${this.gridHeight - this.gridPaddingHeight}%`
        };
        grids.push(item);
      }
      return grids;
    }
    
    private getIrtTitle(titleArray: any) {
      const titles = [];
      for (let i = 0; i < titleArray.length; i += 1) {
        const item = {
          text: titleArray[i],
          textAlign: "center",
          padding: 0,
          left:
            `${(i % this.num) * Math.floor(this.Width / this.num) + Math.floor((Math.floor(this.Width / this.num) - this.gridPaddingWight) / 2) +this.totalPaddingWidth}%`,
          top:
            `${this.gridHeight * Math.floor(i / this.num) + this.totalPaddingHeight - this.titleHeight}%`
        };
        titles.push(item);
      }
      return titles;
    }
    
    private getIrtAxis(count: number, scaleTag: boolean) {
      const Axis = [];
      for (let i = 0; i < count; i += 1) {
        Axis.push({ gridIndex: i, scale: scaleTag });
      }
      return Axis;
    }
    
    private getIrtSeries(data: any[]) {
      const series = [];
      for (let i = 0; i < data.length; i += 1) {
        const regressionDemo = ecStat.regression("linear", data[i], 1);
        const markLineOpt = {
          animation: false,
          label: {
            formatter: regressionDemo.expression,
            align: "right"
          },
          lineStyle: {
            type: "solid"
          },
          tooltip: {
            formatter: regressionDemo.expression
          },
          data: [
            [
              {
                coord: regressionDemo.points[0],
                symbol: "none"
              },
              {
                coord: regressionDemo.points[regressionDemo.points.length - 1],
                symbol: "none"
              }
            ]
          ]
        };
        const seriesItem = {
          type: "scatter",
          showSymbol: false,
          xAxisIndex: i,
          yAxisIndex: i,
          data: data[i],
          markLine: markLineOpt
        };
        series.push(seriesItem);
      }
      return series;
    }
  
    private getSeriesData(xdata: [],ydata: []){
      const data = [];
      const length = Math.min(xdata.length, ydata.length);
      for (let i = 0; i < length; i += 1) {
        data.push([xdata[i],ydata[i]]);
      }
      return data;
    }
  
    private getMarkLine(data: number[],slope: number,intercept: number,formula: string){
      const markLineOpt = {
          animation: false,
          label: {
            formatter: formula,
            align: "right"
          },
          lineStyle: {
            type: "solid"
          },
          tooltip: {
            formatter: formula
          },
          data: [
            [
              {
                coord: Math.min(...data) * slope + intercept,
                symbol: "none"
              },
              {
                coord: Math.max(...data) * slope + intercept,
                symbol: "none"
              }
            ]
          ]
        };
      return markLineOpt;
    }
  }