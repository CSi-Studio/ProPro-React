
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

    // constructor：构造函数，在实例化对象的时候执行
    constructor(data: any[], gridNumInRow: number = 5, gridHeight: number = 100,gridPaddingHeight: number = 50,gridPaddingWight: number = 6,
      totalPaddingHeight: number = 20,totalPaddingWidth: number = 4,titleHeight: number = 20,Width: number = 100) {
      this.data = data;
      this.gridNumInRow = gridNumInRow;
      this.gridHeight = gridHeight;
      this.gridPaddingHeight = gridPaddingHeight;
      this.gridPaddingWight = gridPaddingWight;
      this.totalPaddingHeight = totalPaddingHeight;
      this.totalPaddingWidth = totalPaddingWidth;
      this.titleHeight = titleHeight;
      this.Width = Width;
    }
  
    getWidth(): string {
      return `${this.Width}`;
    }
  
    getIrtOption(): any  {
      const gridNumber = this.data.length;
      return {
        title: this.getIrtTitle(this.data),
        grid: this.getIrtGrids(gridNumber),
        tooltip: {
          formatter: "Group : ({c})"
        },
        xAxis: this.getIrtAxis(gridNumber, true),
        yAxis: this.getIrtAxis(gridNumber, false),
        series: this.getIrtSeries(this.data)
      };
    }
    
    private getIrtGrids(count: number) {
      const grids: any = [];
      for (let i: number = 0; i < count; i += 1) {
        const item: any = {
          left: `${(i % this.gridNumInRow) * Math.floor(this.Width / this.gridNumInRow) + this.totalPaddingWidth}%`,
          top: `${(this.gridHeight + this.gridPaddingHeight) * Math.floor(i / this.gridNumInRow) + this.totalPaddingHeight}px`,
          width: `${Math.floor(this.Width / this.gridNumInRow) - this.gridPaddingWight}%`,
          height: `${this.gridHeight}px`
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
          textAlign: "center",
          textStyle:{
            fontSize: 10   
          },
          padding: 0,
          left:
            `${(i % this.gridNumInRow) * Math.floor(this.Width / this.gridNumInRow) + Math.floor((Math.floor(this.Width / this.gridNumInRow) - this.gridPaddingWight) / 2) +this.totalPaddingWidth}%`,
          top:
            `${(this.gridHeight + this.gridPaddingHeight) * Math.floor(i / this.gridNumInRow) + this.totalPaddingHeight - this.titleHeight}px`,

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
        let seriesItem = {
          type: "scatter",
          showSymbol: false,
          xAxisIndex: i,
          yAxisIndex: i,
          data: this.getSeriesData(data[i].irt.selected.x, data[i].irt.selected.y),
          markLine: this.getMarkLine(data[i].irt.selected.x, data[i].irt.si.slope, data[i].irt.si.intercept, data[i].irt.si.formula)
        };
        series.push(seriesItem);
        seriesItem = {
          type: "scatter",
          showSymbol: false,
          xAxisIndex: i,
          yAxisIndex: i,
          data: this.getSeriesData(data[i].irt.unselected.x, data[i].irt.unselected.y),
          markLine: null
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
      if(data.length === 0){
        return null;
      }
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
                coord: [Math.min(...data), Math.min(...data) * slope + intercept],
                symbol: "none"
              },
              {
                coord: [Math.max(...data), Math.max(...data) * slope + intercept],
                symbol: "none"
              }
            ]
          ]
        };
      return markLineOpt;
    }
  }