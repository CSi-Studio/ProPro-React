import { request } from 'umi';
import type { TableAddItem } from './data';
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

/** 添加蛋白fasta文件 POST /api/library/add */
export async function addList(body: {
  createTag?: any;
  reviewed?: any;
  createLibrary?: any;
  libraryName?: any;
  filePath?: any;
  spModel?: any;
  isotope?: any;
  minPepLen?: any;
  maxPepLen?: any;
}) {
  const fileData = new FormData();
  fileData.append('createTag', body.createTag);
  fileData.append('reviewed', body.reviewed);
  fileData.append('createLibrary', body.createLibrary);
  fileData.append('libraryName', body.libraryName);
  fileData.append('libFile', body.filePath[0].originFileObj);
  fileData.append('spModel', body.spModel);
  fileData.append('isotope', body.isotope);
  fileData.append('minPepLen', body.minPepLen);
  fileData.append('maxPepLen', body.maxPepLen);
  return request<TableAddItem>(`${url}/protein/add`, {
    method: 'POST',
    header: {
      Accept: 'application/json',
    },
    data: fileData,
  });
}

export class IrtOption {
  gridHeight: number; // 单张图高度
  gridPaddingHeight = 7; // 单图高度下缩进
  gridPaddingWight = 10; // 单图宽度右缩进
  totalPaddingHeight = 5; // 整体高度缩进
  totalPaddingWidth = 10; // 整体宽度左缩进,值小于等于PadWight
  titleHeight = 2; //  标题高度
  Width = 100; // 总宽度
  // constructor：构造函数，在实例化对象的时候执行
  constructor(gridHeight: number,gridPaddingHeight: number,gridPaddingWight: number,totalPaddingHeight: number,totalPaddingWidth: number,titleHeight: number,Width: number) {
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


  getIrtOption(num: number, data: any, title: any): any  {
    return {
      title: this.getIrtTitle(num, title),
      grid: this.getIrtGrids(num, data.length),
      tooltip: {
        formatter: "Group {a}: ({c})"
      },
      xAxis: this.getIrtAxis(data.length, true),
      yAxis: this.getIrtAxis(data.length, false),
      series: this.getIrtSeries(data)
    };
  }
  
  
  getIrtGrids(num: number, count: number) {
    const grids: any = [];
    for (let i: number = 0; i < count; i += 1) {
      const item: any = {
        left: `${(i % num) * Math.floor(this.Width / num) + this.totalPaddingWidth}%`,
        top: `${this.gridHeight * Math.floor(i / num) + this.totalPaddingHeight}%`,
        width: `${Math.floor(this.Width / num) - this.totalPaddingWidth}%`,
        height: `${this.gridHeight - this.gridPaddingHeight}%`
      };
      grids.push(item);
    }
    return grids;
  }
  
  getIrtTitle(num: number, title: any) {
    const titles = [];
    for (let i = 0; i < title.length; i += 1) {
      const item = {
        text: title[i],
        textAlign: "center",
        padding: 0,
        left:
          `${(i % num) * Math.floor(this.Width / num) + Math.floor((Math.floor(this.Width / num) - this.gridPaddingWight) / 2) +this.totalPaddingWidth}%`,
        top:
          `${this.gridHeight * Math.floor(i / num) + this.totalPaddingHeight - this.titleHeight}%`
      };
      titles.push(item);
    }
    return titles;
  }
  
  getIrtAxis(count: number, scale1: boolean) {
    const Axis = [];
    for (let i = 0; i < count; i += 1) {
      Axis.push({ gridIndex: i, scale: scale1 });
    }
    return Axis;
  }
  
  getIrtSeries(data: any) {
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

