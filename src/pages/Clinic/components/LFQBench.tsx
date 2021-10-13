import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Col, Descriptions, Row, Tag } from 'antd';

export type QtChartsProps = {
  values: any;
};

const LFQBench: React.FC<QtChartsProps> = (props: any) => {
  const [handleOption, setHandleOption] = useState({});
  const [ratioData, setRatioData] = useState<any>();
  /* 获取echarts实例，使用其Api */
  const [echarts, setEcharts] = useState<any>();

  useEffect(() => {
    const op = async () => {
      const result = props.values.peptideRatioData;
      let minX = 99999;
      let maxX = 0;
      let minY = 99999;
      let maxY = 0;
      const ecoliData = result.data.ecoli.map((data: { peptide: string; x: any; y: any }) => {
        minX = data.x < minX ? data.x : minX;
        maxX = data.x > maxX ? data.x : maxX;
        minY = data.y < minY ? data.y : minY;
        maxY = data.y > maxY ? data.y : maxY;
        return [data.x, data.y, data.peptide];
      });
      const humanData = result.data.human.map((data: { peptide: string; x: any; y: any }) => {
        minX = data.x < minX ? data.x : minX;
        maxX = data.x > maxX ? data.x : maxX;
        minY = data.y < minY ? data.y : minY;
        maxY = data.y > maxY ? data.y : maxY;
        return [data.x, data.y, data.peptide];
      });
      const yeastData = result.data.yeast.map((data: { peptide: string; x: any; y: any }) => {
        minX = data.x < minX ? data.x : minX;
        maxX = data.x > maxX ? data.x : maxX;
        minY = data.y < minY ? data.y : minY;
        maxY = data.y > maxY ? data.y : maxY;
        return [data.x, data.y, data.peptide];
      });

      setRatioData(result.data);
      /* 中位数 */
      const median = (arr: any) => {
        const mid = Math.floor(arr.length / 2);
        const nums = [...arr].sort((a: any, b: any) => a - b);
        return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
      };

      // result.data.ecoliPercentile.unshift('ecoli');
      // result.data.humanPercentile.unshift('human');
      // result.data.yeastPercentile.unshift('yeast');

      const option = {
        grid: [
          {
            show: true,
            top: '5%',
            left: '3%',
            right: '19%',
            bottom: '2%',
            containLabel: true,
            tooltip: {
              show: true,
              backgroundColor: ['rgba(255,255,255,0.9)'],
              axisPointer: {
                type: 'cross',
                snap: true,
              },
              textStyle: {
                color: '#000',
                fontSize: '14',
                fontWeight: 'normal',
                fontFamily: 'Times New Roman,STSong',
              },
              formatter: (params: { seriesName: any; data: any[]; marker: any }) => {
                let res = params?.seriesName;
                res += `<br />蛋白：${params?.data[2].split('-->')[0]}<br />肽段：${
                  params?.data[2].split('-->')[1]
                }<br />${params?.marker}${params?.data[0]?.toFixed(
                  4,
                )} &nbsp ${params?.data[1]?.toFixed(4)}`;
                return res;
              },
            },
          },
          {
            show: true,
            top: '5%',
            left: '81%',
            right: '3%',
            bottom: '2%',
            containLabel: true,
          },
        ],
        xAxis: [
          {
            type: 'value',
            gridIndex: 0,
            nameLocation: 'middle',
            name: 'Log2(B)',
            min: minX,
            max: maxX,
            splitLine: {
              show: false,
            },
            scale: true,
            axisLabel: {
              color: '#000',
              show: true,
              fontFamily: 'Times New Roman,STSong',
              fontWeight: 'normal',
              formatter(value: any) {
                return value.toFixed(1);
              },
            },
            nameTextStyle: {
              color: '#000',
              fontSize: '16',
              fontWeight: 'bold',
              fontFamily: 'Times New Roman,STSong',
              align: 'left',
            },
          },
          {
            type: 'category',
            gridIndex: 1,
            splitArea: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLabel: {
              color: 'transparent',
              show: true,
              fontFamily: 'Times New Roman,STSong',
              fontWeight: 'normal',
            },
            // axisLine: { show: false },
            // axisTick: { show: false },
          },
        ],
        yAxis: [
          {
            nameRotate: 90,
            nameGap: 30,
            nameLocation: 'middle',
            gridIndex: 0,
            name: 'Log2(A:B)',
            min: minY,
            max: maxY,
            splitLine: {
              show: false,
            },
            scale: true,
            axisLabel: {
              color: '#000',
              show: true,
              fontFamily: 'Times New Roman,STSong',
              fontWeight: 'normal',
              formatter(value: any) {
                return value.toFixed(1);
              },
            },
            nameTextStyle: {
              // lineHeight: 56,
              color: '#000',
              fontSize: '16',
              fontWeight: 'bold',
              fontFamily: 'Times New Roman,STSong',
              align: 'left',
              padding: '40',
            },
          },
          {
            gridIndex: 1,
            min: minY,
            max: maxY,
            splitLine: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
          },
        ],
        animation: false,
        toolbox: {
          feature: {
            restore: {},
            dataView: {},
            saveAsImage: {},
          },
        },
        dataZoom: [
          { type: 'inside', xAxisIndex: 0 },
          { type: 'inside', xAxisIndex: 1 },
        ],
        tooltip: {},
        legend: {
          right: '8%',
          gridIndex: 0,
          align: 'left',
          textStyle: {
            fontSize: '14',
            fontFamily: 'Times New Roman,STSong',
          },
        },
        dataset: [
          {
            source: [result.data.ecoliPercentile],
          },
          {
            source: [result.data.humanPercentile],
          },
          {
            source: [result.data.yeastPercentile],
          },
          {
            fromDatasetIndex: 0,
            transform: {
              type: 'boxplot',
              config: {
                itemNameFormatter: (params: any) => {
                  if (params.value === 0) {
                    return 'ecoli';
                  }
                  if (params.value === 1) {
                    return 'human';
                  }
                  return 'yeast';
                },
              },
            },
          },
          {
            fromDatasetIndex: 1,
            transform: {
              type: 'boxplot',
              config: {
                itemNameFormatter: (params: any) => {
                  if (params.value === 0) {
                    return 'ecoli';
                  }
                  if (params.value === 1) {
                    return 'human';
                  }
                  return 'yeast';
                },
              },
            },
          },
          {
            fromDatasetIndex: 2,
            transform: {
              type: 'boxplot',
              config: {
                itemNameFormatter: (params: any) => {
                  if (params.value === 0) {
                    return 'ecoli';
                  }
                  if (params.value === 1) {
                    return 'human';
                  }
                  return 'yeast';
                },
              },
            },
          },
          {
            fromDatasetIndex: 3,
            fromTransformResult: 1,
          },
          {
            fromDatasetIndex: 4,
            fromTransformResult: 1,
          },
          {
            fromDatasetIndex: 5,
            fromTransformResult: 1,
          },
        ],
        series: [
          {
            type: 'scatter',
            name: 'ecoli',
            symbolSize: 5,
            xAxisIndex: 0,
            yAxisIndex: 0,
            color: 'rgba(255,99,71,0.5)',
            data: ecoliData,
            itemStyle: { borderWidth: 1, borderColor: 'tomato' },
            markLine: {
              symbol: ['none', 'none'],
              animation: false,
              lineStyle: {
                type: 'dashed',
                color: '#333',
                width: 2,
              },
              emphasis: {
                lineStyle: {
                  type: 'dashed',
                  color: 'gold',
                  width: 3,
                },
              },
              label: { show: false },
              data: [{ yAxis: median(result.data.ecoliPercentile), name: 'ecoli' }],
              tooltip: {
                backgroundColor: ['rgba(255,255,255,0.9)'],
                axisPointer: {
                  type: 'cross',
                  snap: true,
                },
                textStyle: {
                  color: '#000',
                  fontSize: '14',
                  fontWeight: 'normal',
                  fontFamily: 'Times New Roman,STSong',
                },
                formatter: (params: { value: number; name: string }) => {
                  const res = `${params.name}</br>中位数：${params.value}`;
                  return res;
                },
              },
            },
          },
          {
            type: 'scatter',
            name: 'human',
            symbolSize: 5,
            xAxisIndex: 0,
            yAxisIndex: 0,
            color: 'rgba(64,144,247,0.5)',
            itemStyle: { borderWidth: 1, borderColor: 'rgba(64,144,247)' },
            data: humanData,
            markLine: {
              symbol: ['none', 'none'],
              animation: false,
              lineStyle: {
                type: 'dashed',
                color: '#333',
                width: 2,
              },
              emphasis: {
                lineStyle: {
                  type: 'dashed',
                  color: 'gold',
                  width: 3,
                },
              },
              label: { show: false },
              data: [{ yAxis: median(result.data.humanPercentile), name: 'human' }],
              tooltip: {
                backgroundColor: ['rgba(255,255,255,0.9)'],
                axisPointer: {
                  type: 'cross',
                  snap: true,
                },
                textStyle: {
                  color: '#000',
                  fontSize: '14',
                  fontWeight: 'normal',
                  fontFamily: 'Times New Roman,STSong',
                },
                formatter: (params: { value: number; name: string }) => {
                  const res = `${params.name}</br>平均值：${params.value}`;
                  return res;
                },
              },
            },
          },
          {
            type: 'scatter',
            name: 'yeast',
            symbolSize: 5,
            xAxisIndex: 0,
            yAxisIndex: 0,
            color: 'rgba(60,179,113,0.5)',
            itemStyle: { borderWidth: 1, borderColor: 'rgba(60,179,113)' },
            data: yeastData,
            markLine: {
              symbol: ['none', 'none'],
              animation: false,
              lineStyle: {
                type: 'dashed',
                color: '#333',
                width: 2,
              },
              emphasis: {
                lineStyle: {
                  type: 'dashed',
                  color: 'gold',
                  width: 3,
                },
              },
              label: { show: false },
              data: [{ yAxis: median(result.data.yeastPercentile), name: 'yeast' }],
              tooltip: {
                backgroundColor: ['rgba(255,255,255,0.9)'],
                axisPointer: {
                  type: 'cross',
                  snap: true,
                },
                textStyle: {
                  color: '#000',
                  fontSize: '14',
                  fontWeight: 'normal',
                  fontFamily: 'Times New Roman,STSong',
                },
                formatter: (params: { value: number; name: string }) => {
                  const res = `${params.name}</br>平均值：${params.value}`;
                  return res;
                },
              },
            },
          },
          {
            name: 'ecoli',
            xAxisIndex: 1,
            yAxisIndex: 1,
            datasetIndex: 3,
            boxWidth: [7, 20],
            type: 'boxplot',
            color: 'rgba(255,99,71,0.5)',
            itemStyle: { borderWidth: 2 },
            tooltip: {
              formatter(param: { name: any; data: any[] }) {
                return [
                  `<strong>${param.name}</strong>`,
                  `Max: &nbsp&nbsp${param.data[5]}`,
                  `Q3 &nbsp: &nbsp&nbsp${param.data[4]}`,
                  `Med: &nbsp&nbsp${param.data[3]}`,
                  `Q1 &nbsp: &nbsp&nbsp${param.data[2]}`,
                  `Min: &nbsp&nbsp${param.data[1]}`,
                ].join('<br/>');
              },
              backgroundColor: ['rgba(255,255,255,0.9)'],
              axisPointer: {
                type: 'cross',
                snap: true,
              },
              textStyle: {
                color: '#000',
                fontSize: '14',
                fontWeight: 'normal',
                fontFamily: 'Times New Roman,STSong',
              },
            },
          },
          {
            name: 'ecoli',
            type: 'scatter',
            xAxisIndex: 1,
            yAxisIndex: 1,
            datasetIndex: 6,
            color: 'rgba(255,99,71,0.5)',
          },
          {
            name: 'human',
            xAxisIndex: 1,
            yAxisIndex: 1,
            type: 'boxplot',
            datasetIndex: 4,
            boxWidth: [7, 20],
            color: 'rgba(64,144,247,0.5)',
            itemStyle: { borderWidth: 2 },
            tooltip: {
              formatter(param: { name: any; data: any[] }) {
                return [
                  `<strong>${param.name}</strong>`,
                  `Max: &nbsp&nbsp${param.data[5]}`,
                  `Q3 &nbsp: &nbsp&nbsp${param.data[4]}`,
                  `Med: &nbsp&nbsp${param.data[3]}`,
                  `Q1 &nbsp: &nbsp&nbsp${param.data[2]}`,
                  `Min: &nbsp&nbsp${param.data[1]}`,
                ].join('<br/>');
              },
              backgroundColor: ['rgba(255,255,255,0.9)'],
              axisPointer: {
                type: 'cross',
                snap: true,
              },
              textStyle: {
                color: '#000',
                fontSize: '14',
                fontWeight: 'normal',
                fontFamily: 'Times New Roman,STSong',
              },
            },
          },
          {
            name: 'human',
            type: 'scatter',
            xAxisIndex: 1,
            yAxisIndex: 1,
            datasetIndex: 7,
            color: 'rgba(64,144,247,0.5)',
          },
          {
            name: 'yeast',
            xAxisIndex: 1,
            yAxisIndex: 1,
            type: 'boxplot',
            boxWidth: [7, 20],
            datasetIndex: 5,
            color: 'rgba(60,179,113,0.5)',
            itemStyle: { borderWidth: 2 },
            tooltip: {
              formatter(param: { name: any; data: any[] }) {
                return [
                  `<strong>${param.name}</strong>`,
                  `Max: &nbsp&nbsp${param.data[5]}`,
                  `Q3 &nbsp: &nbsp&nbsp${param.data[4]}`,
                  `Med: &nbsp&nbsp${param.data[3]}`,
                  `Q1 &nbsp: &nbsp&nbsp${param.data[2]}`,
                  `Min: &nbsp&nbsp${param.data[1]}`,
                ].join('<br/>');
              },
              backgroundColor: ['rgba(255,255,255,0.9)'],
              axisPointer: {
                type: 'cross',
                snap: true,
              },
              textStyle: {
                color: '#000',
                fontSize: '14',
                fontWeight: 'normal',
                fontFamily: 'Times New Roman,STSong',
              },
            },
          },
          {
            name: 'yeast',
            type: 'scatter',
            color: 'rgba(60,179,113,0.5)',
            xAxisIndex: 1,
            yAxisIndex: 1,
            datasetIndex: 8,
          },
        ],
      };
      setHandleOption(option);
    };
    op();
  }, []);

  /* 点击某个点跳到EIC图 */
  echarts?.getEchartsInstance().off('click'); // 防止多次触发
  echarts?.getEchartsInstance().on('click', (params: any) => {
    if (params.seriesType === 'scatter') {
      const protein = params?.data[2]?.split('-->')[0];
      const peptide = params?.data[2]?.split('-->')[1];
      props?.values.LFQClick(protein, peptide);
    }
  });

  return (
    <Row>
      <Col span="6">
        <Descriptions title="蛋白鉴定数(Unique)" column={2}>
          <Descriptions.Item label="A">
            <Tag color="blue">{ratioData?.identifyProteinNumA}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="B">
            <Tag color="blue">{ratioData?.identifyProteinNumB}</Tag>
          </Descriptions.Item>
        </Descriptions>
        <Descriptions title="肽段鉴定数(Unique)" column={2}>
          <Descriptions.Item label="A">
            <Tag color="blue">{ratioData?.identifyNumA}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="缺失率">
            <Tag color="red">{`${(ratioData?.missingRatioA * 100).toFixed(2)}%`}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="B">
            <Tag color="blue">{ratioData?.identifyNumB}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="缺失率">
            <Tag color="red">{`${(ratioData?.missingRatioB * 100).toFixed(2)}%`}</Tag>
          </Descriptions.Item>
        </Descriptions>
        <Descriptions title="Hit比例(1:2:3)" column={1}>
          <Descriptions.Item label="A">
            <Tag color="red">{ratioData?.hit1A}</Tag>
            <Tag color="blue">{ratioData?.hit2A}</Tag>
            <Tag color="green">{ratioData?.hit3A}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="A.Ratio">
            <Tag color="red">{`${((ratioData?.hit1A * 100) / ratioData?.identifyNumA).toFixed(
              2,
            )}%`}</Tag>
            <Tag color="blue">{`${((ratioData?.hit2A * 100) / ratioData?.identifyNumA).toFixed(
              2,
            )}%`}</Tag>
            <Tag color="green">{`${((ratioData?.hit3A * 100) / ratioData?.identifyNumA).toFixed(
              2,
            )}%`}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="B">
            <Tag color="red">{ratioData?.hit1B}</Tag>
            <Tag color="blue">{ratioData?.hit2B}</Tag>
            <Tag color="green">{ratioData?.hit3B}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="B.Ratio">
            <Tag color="red">{`${((ratioData?.hit1B * 100) / ratioData?.identifyNumB).toFixed(
              2,
            )}%`}</Tag>
            <Tag color="blue">{`${((ratioData?.hit2B * 100) / ratioData?.identifyNumB).toFixed(
              2,
            )}%`}</Tag>
            <Tag color="green">{`${((ratioData?.hit3B * 100) / ratioData?.identifyNumB).toFixed(
              2,
            )}%`}</Tag>
          </Descriptions.Item>
        </Descriptions>
        <Descriptions title="Yeast(Avg:SD:CV:Percentile49)" column={1}>
          <Descriptions.Item label="Stat">
            <Tag color="blue">{ratioData?.yeastAvg.toFixed(4)}</Tag>
            <Tag color="blue">{ratioData?.yeastCV.toFixed(4)}</Tag>
            <Tag color="blue">{ratioData?.yeastSD.toFixed(4)}</Tag>
            <Tag color="blue">{ratioData?.yeastPercentile[49].toFixed(4)}</Tag>
          </Descriptions.Item>
        </Descriptions>
        <Descriptions title="Human(Avg:SD:CV:Percentile49)" column={1}>
          <Descriptions.Item label="Stat">
            <Tag color="blue">{ratioData?.humanAvg.toFixed(4)}</Tag>
            <Tag color="blue">{ratioData?.humanCV.toFixed(4)}</Tag>
            <Tag color="blue">{ratioData?.humanSD.toFixed(4)}</Tag>
            <Tag color="blue">{ratioData?.humanPercentile[49].toFixed(4)}</Tag>
          </Descriptions.Item>
        </Descriptions>
        <Descriptions title="EColi(Avg:SD:CV:Percentile49)" column={1}>
          <Descriptions.Item label="Stat">
            <Tag color="blue">{ratioData?.ecoliAvg.toFixed(4)}</Tag>
            <Tag color="blue">{ratioData?.ecoliCV.toFixed(4)}</Tag>
            <Tag color="blue">{ratioData?.ecoliSD.toFixed(4)}</Tag>
            <Tag color="blue">{ratioData?.ecoliPercentile[49].toFixed(4)}</Tag>
          </Descriptions.Item>
        </Descriptions>
      </Col>
      <Col span="18">
        <ReactECharts
          ref={(e) => {
            setEcharts(e);
          }}
          option={handleOption}
          style={{ width: `100%`, height: '700px' }}
          lazyUpdate={true}
        />
      </Col>
    </Row>
  );
};

export default LFQBench;
