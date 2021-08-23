import { request } from 'umi';
import {url} from '@/utils/request'
import * as ecStat from "echarts-stat";

/** 获取肽段列表 GET /peptide/list */
export async function proteinList(params: {
  // query
  /** 当前的页码 */
  current?: number;
  /** 页面的容量 */
  pageSize?: number;
  /** 选择的标准库ID */
}) {
  return request(`${url}/protein/list`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export class IrtOption {
  private data: any[]; // 点数据数组
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
    totalPaddingHeight: number = 5,totalPaddingWidth: number = 5,titleHeight: number = 3,Width: number = 100) {
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
}

const titleAll = ["气温变化", "空气质量指数", "C31231231231232131221", "D","气温变化", "空气质量指数"];
const dataAll = [
  [
    [10.0, 8.04],
    [8.0, 6.95],
    [13.0, 7.58],
    [9.0, 8.81],
    [11.0, 8.33],
    [14.0, 9.96],
    [6.0, 7.24],
    [4.0, 4.26],
    [12.0, 10.84],
    [7.0, 4.82],
    [5.0, 5.68]
  ],
  [
    [10.0, 9.14],
    [8.0, 8.14],
    [13.0, 8.74],
    [9.0, 8.77],
    [11.0, 9.26],
    [14.0, 8.1],
    [6.0, 6.13],
    [4.0, 3.1],
    [12.0, 9.13],
    [7.0, 7.26]
  ],
  [
    [10.0, 7.46],
    [8.0, 6.77],
    [13.0, 12.74],
    [9.0, 7.11],
    [11.0, 7.81],
    [14.0, 8.84],
    [6.0, 6.08],
    [4.0, 5.39],
    [12.0, 8.15],
    [7.0, 6.42],
    [5.0, 5.73]
  ],
  [
    [8.0, 6.58],
    [8.0, 5.76],
    [8.0, 7.71],
    [8.0, 8.84],
    [8.0, 8.47],
    [8.0, 7.04],
    [8.0, 5.25],
    [19.0, 12.5],
    [8.0, 5.56],
    [8.0, 7.91],
    [8.0, 6.89]
  ],
  [
    [10.0, 8.04],
    [8.0, 6.95],
    [13.0, 7.58],
    [9.0, 8.81],
    [11.0, 8.33],
    [14.0, 9.96],
    [6.0, 7.24],
    [4.0, 4.26],
    [12.0, 10.84],
    [7.0, 4.82],
    [5.0, 5.68]
  ],
  [
    [10.0, 9.14],
    [8.0, 8.14],
    [13.0, 8.74],
    [9.0, 8.77],
    [11.0, 9.26],
    [14.0, 8.1],
    [6.0, 6.13],
    [4.0, 3.1],
    [12.0, 9.13],
    [7.0, 7.26]
  ]
];
const irt = new IrtOption(dataAll,titleAll,5);
export const option = irt.getIrtOption();

