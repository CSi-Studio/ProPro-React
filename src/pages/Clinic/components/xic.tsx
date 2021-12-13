import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import ProCard from '@ant-design/pro-card';
import { isEqual, uniqWith, compact } from 'lodash';
import { Form, message, notification } from 'antd';
import { useIntl } from 'umi';
import UpdateRt from './UpdateRt';
import { manualCheck } from '../service';

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
let rtTimeIn: { alias: string; range: any[]; overviewId: string }[] = [];

export type IrtChartsProps = {
  values: any;
};

const XicCharts: React.FC<IrtChartsProps> = (props: any) => {
  const intensityKey = props.values.intensityValue.map((value: any) => value.name);
  const gridNumberInRow = props.values.gridNumberInRow;
  const xicData: any[] = props.values.result;
  const rtAlign: boolean = props.values.rtAlign;
  const projectId: string = props.values.projectId;
  const runId: string = props.values.runId;
  const intl = useIntl();
  const [formUpdate] = Form.useForm();

  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [rtTime, setRtTime] = useState<Record<string, any>[]>([]);
  const [echarts, setEcharts] = useState<any>();
  const [option, setOption] = useState<any>({});
  const [data, setData] = useState<any>(xicData);
  const [handleOption, setHandleOption] = useState<boolean>(false);

  const openNotification = () => {
    notification.open({
      message: '重选峰',
      description: `${rtTimeIn.map((item: any) => {
        return `${item.alias}：
        ${item.range.join('-')}
        `;
      })}`,
      className: 'custom-class',
      style: {
        width: 300,
      },
    });
  };
  /**
   * 修改峰
   * @param values
   */
  const updateRt = async (values: any) => {
    const hide = message.loading(
      `${intl.formatMessage({
        id: 'message.adding',
        defaultMessage: '正在添加...',
      })}`,
    );
    try {
      await manualCheck(values);
      hide();
      message.success(
        `${intl.formatMessage({
          id: 'message.addSuccess',
          defaultMessage: '添加成功！',
        })}`,
      );
      return true;
    } catch (error) {
      hide();
      message.error(
        `${intl.formatMessage({
          id: 'message.addFail',
          defaultMessage: '添加失败，请重试！',
        })}`,
      );
      return false;
    }
  };

  // 使legend的每一个和intensity一一对应
  let intMap = data.map((value: { intMap: {} }) => {
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
      allCutMz.push({ name: key, value: item.cutInfoMap[key], selected: true });
    });
  });
  // 去重 排序 lodash的方法
  allCutMz = uniqWith(allCutMz, isEqual).sort((a, b) => (a.value > b.value ? -1 : 1));
  const allCutMzRight = allCutMz?.slice(-5).map((item: any) => {
    item.selected = false;
    return item;
  });
  const selected = {};
  allCutMzRight.forEach((item: any) => {
    selected[item.name] = item.selected;
  });

  const allCutMzLeft = allCutMz?.splice(0, allCutMz.length - 5);
  allCutMz = allCutMzLeft?.concat(allCutMzRight);

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
          '#eee',
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
        text: `${data[i].alias} (${data[i].runId.substring(data[i].runId.length - 5)} - ${data[
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
          `{fdr|${data[i]?.fdr ? `fdr: ${data[i]?.fdr?.toFixed(4)}` : `fdr: -`}}`,
          `{sum|${data[i]?.intensitySum ? `sum: ${data[i]?.intensitySum?.toFixed(0)}` : `sum: -`}}`,
          `{best|${data[i]?.bestIon ? `best: ${data[i]?.bestIon}` : `best: -`}}`,
          `{fit|${data[i]?.fitIntSum ? `fit: ${data[i]?.fitIntSum?.toFixed(0)}` : `fit: -`}}`,
          `{ms1|${data[i]?.ms1Sum ? `ms1: ${data[i]?.ms1Sum?.toFixed(0)}` : `ms1: -`}}`,
          `{rt|${
            data[i]?.peakGroupList !== null ? `rt: ${data[i]?.apexRt?.toFixed(3)}` : `rt: -`
          }}`,
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
                '#666',
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
                '#fff',
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
            ms1: {
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
            best: {
              color: 'white',
              fontSize: '12',
              fontWeight: 'normal',
              fontFamily: 'Times New Roman,STSong',
              backgroundColor: 'orange',
              borderColor: '#F3A83C',
              borderWidth: 1,
              borderRadius: 2,
              padding: [3, 3],
            },
            fit: {
              color: 'white',
              fontSize: '12',
              fontWeight: 'normal',
              fontFamily: 'Times New Roman,STSong',
              backgroundColor: 'orange',
              borderColor: '#F3A83C',
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
          showMinLabel: true,
          showMaxLabel: true,
        },
        nameTextStyle: {
          color: '#000',
          fontSize: '16',
          fontWeight: 'bold',
          fontFamily: 'Times New Roman,STSong',
          align: 'left',
        },
        min: rtAlign ? min : Math.floor(Math.min(...data[i].rtArray)),
        max: rtAlign ? max : Math.floor(Math.max(...data[i].rtArray)),
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
  const getMarkArea = (value: {
    peakGroupList: { leftRt: number; rightRt: number }[];
    selectIndex: number;
  }) => {
    if (!value.peakGroupList) {
      return null;
    }
    const markAreaOpt: any = {
      animation: false,
      data: [],
    };

    value.peakGroupList.forEach((item: { leftRt: number; rightRt: number }, index) => {
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
        left: '0%',
        width: '100%',
        top: `${6}px`,
        padding: 0,
        type: 'scroll',
        icon: 'circle',
        itemStyle: {},
        inactiveColor: '#bbb',
        itemGap: 12,
        textStyle: {
          fontSize: '14',
          padding: -8,
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
          fontFamily: 'Times New Roman,STSong',
        },
        selected: selected,
        selector: [
          {
            type: 'all or inverse',
            title: 'All',
          },
          {
            type: 'inverse',
            title: 'Inv',
          },
        ],
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
    const keyName: any = [];
    for (let i = 0; i < data.length; i += 1) {
      // rt赋值
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

          let html = `<div id="specialLook" style="pointer-events: all;"
          onclick="
            chartsFn(paramsTool);
          " 
          ><strong>Spectrum</strong></div>${params[0].axisValue}<br />`;
          params.forEach((item: any) => {
            html += `${item.marker}<span style="display:inline-block;min-width:34px">${item.seriesName}</span>&nbsp&nbsp<span style="font-weight:bold;color:#3574E0;">${item.data[1]}</span><br />`;
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
        iconStyle: {
          borderColor: '#666',
          borderWidth: 1,
        },
        feature: {
          myTool1: {
            show: true,
            title: '保存',
            icon: 'path://M6 4h10.586L20 7.414V18a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3zm0 1a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7.914L16.086 5H15v5H6V5zm1 0v4h7V5H7zm5 7a3 3 0 1 1 0 6a3 3 0 0 1 0-6zm0 1a2 2 0 1 0 0 4a2 2 0 0 0 0-4z',
            onclick: function () {
              if (rtTimeIn[0]?.overviewId === undefined) {
                message.error('请选择一个峰');
              } else {
                updateRt({
                  peptideRef: data[0].peptideRef,
                  overViewIds: [rtTimeIn[0]?.overviewId],
                  range: rtTimeIn[0]?.range,
                  projectId,
                  runId,
                });
                setRtTime(rtTimeIn);
                // handleUpdateModalVisible(true);
                openNotification();
              }
            },
          },
          brush: {
            title: {
              lineX: '重新选峰',
              keep: '允许多选',
              clear: '清除选择',
            },
            type: ['lineX', 'keep', 'clear'],
          },
          restore: {
            title: '还原',
          },
          dataView: {
            title: '数据视图',
          },
          saveAsImage: {
            title: '保存图片',
          },
        },
      },
      brush: {
        xAxisIndex: 'all',
        brushLink: 'all',
        outOfBrush: {
          // colorAlpha: 0.1,
          color: '#ddd',
        },
        brushStyle: {
          borderWidth: 2,
          color: 'rgba(120,140,180,0.3)',
          borderColor: 'rgba(120,140,180,0.8)',
        },
      },
      animation: false,
      legend: getXicLegend(),
    };
  };
  useEffect(() => {
    if (data.length > 0) {
      setOption(getXicOption());
    }
  }, []);
  useEffect(() => {
    setOption(getXicOption());
  }, [handleOption]);

  // setOption(getXicOption());

  /* 获取brush数据 */
  // echarts?.getEchartsInstance().off('click'); // 防止多次触发
  // echarts?.getEchartsInstance().on('click', (params: any) => {
  //   console.log(params);
  // });
  // echarts?.getEchartsInstance().on('contextmenu', (params: any) => {
  //   message.success('右键菜单');
  // });

  echarts?.getEchartsInstance().off('brushEnd');
  echarts?.getEchartsInstance().on('brushEnd', (params: any) => {
    if (params.type === 'brushend') {
      rtTimeIn = params.areas.map((item: any) => {
        // const newData = data[item?.panelId?.split('')[14]].peakGroupList;
        const newData = data;
        newData[item?.panelId?.split('')[14]].peakGroupList.push({
          apexRt: (item?.coordRange[1] - item?.coordRange[0]) / 2 + item?.coordRange[0],
          selectedRt: (item?.coordRange[1] - item?.coordRange[0]) / 2 + item?.coordRange[0],
          fine: false,
          leftRt: item?.coordRange[0],
          rightRt: item?.coordRange[1],
        });
        setData(newData);
        setHandleOption(!handleOption);
        return {
          alias: data[item?.panelId?.split('')[14]]?.alias,
          range: item?.coordRange,
          overviewId: data[item?.panelId?.split('')[14]]?.overviewId,
        };
      });
    }
  });
  // console.log(getXicOption());

  // document.body.oncontextmenu = function () {
  //   return false;
  // };

  return (
    <ProCard>
      <ReactECharts
        ref={(e) => {
          setEcharts(e);
        }}
        option={option}
        style={{ width: `100%`, height: Height }}
        lazyUpdate={true}
      />
      <UpdateRt
        form={formUpdate}
        onCancel={() => {
          handleUpdateModalVisible(false);
          formUpdate?.resetFields();
        }}
        onSubmit={async (value: any) => {
          // const success = await updataRt(value);
          // if (success) {
          //   handleUpdateModalVisible(false);
          //   setCurrentRow(undefined);
          //   if (actionRef.current) {
          //     actionRef.current.reload();
          //   }
          // }
        }}
        updateModalVisible={updateModalVisible}
        values={rtTime}
      />
    </ProCard>
  );
};

// XicCharts = forwardRef(XicCharts);

export default XicCharts;
