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
      const option = {
        grid: [
          {
            show: true,
            top: '5%',
            left: '1%',
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
              color: '#000',
              show: true,
              fontFamily: 'Times New Roman,STSong',
              fontWeight: 'normal',
            },
            // axisLabel: {
            //   show: false,
            // },
            // axisLine: { show: false },
            // axisTick: { show: false },
          },
        ],
        yAxis: [
          {
            nameRotate: 90,
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
            dimensions: ['name', 'data'],
            source: [
              // { name: 'ecoli', data: result.data.ecoliPercentile },
              // { name: 'human', data: result.data.humanPercentile },
              // { name: 'yeast', data: result.data.yeastPercentile },
              // result.data.ecoliPercentile.unshift('ecoli'),
              // result.data.humanPercentile.unshift('human'),
              // result.data.yeastPercentile.unshift('yeast'),
              result.data.ecoliPercentile,
              result.data.humanPercentile,
              result.data.yeastPercentile,
            ],
          },
          {
            transform: {
              type: 'boxplot',
            },
          },
          {
            fromDatasetIndex: 1,
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
              data: [{ yAxis: result.data.ecoliAvg, name: 'ecoli' }],
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
              data: [{ yAxis: result.data.humanAvg, name: 'human' }],
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
              data: [{ yAxis: result.data.yeastAvg, name: 'yeast' }],
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
            xAxisIndex: 1,
            yAxisIndex: 1,
            type: 'boxplot',
            datasetIndex: 1,
            tooltip: {
              formatter(param: { name: any; data: any[] }) {
                console.log(param);
                return [
                  `Experiment ${param.name}: `,
                  `upper: ${param.data[5]}`,
                  `Q3: ${param.data[4]}`,
                  `median: ${param.data[3]}`,
                  `Q1: ${param.data[2]}`,
                  `lower: ${param.data[1]}`,
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
            xAxisIndex: 1,
            yAxisIndex: 1,
            datasetIndex: 2,
            type: 'scatter',
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
    const protein = params?.data[2].split('-->')[0];
    const peptide = params?.data[2].split('-->')[1];
    props.values.LFQClick(protein, peptide);
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
        <Descriptions title="Yeast(Avg:SD:CV:Percentile50)" column={1}>
          <Descriptions.Item label="Stat">
            <Tag color="blue">{ratioData?.yeastAvg.toFixed(4)}</Tag>
            <Tag color="blue">{ratioData?.yeastCV.toFixed(4)}</Tag>
            <Tag color="blue">{ratioData?.yeastSD.toFixed(4)}</Tag>
            <Tag color="blue">{ratioData?.yeastPercentile[50].toFixed(4)}</Tag>
          </Descriptions.Item>
        </Descriptions>
        <Descriptions title="Human(Avg:SD:CV:Percentile50)" column={1}>
          <Descriptions.Item label="Stat">
            <Tag color="blue">{ratioData?.humanAvg.toFixed(4)}</Tag>
            <Tag color="blue">{ratioData?.humanCV.toFixed(4)}</Tag>
            <Tag color="blue">{ratioData?.humanSD.toFixed(4)}</Tag>
            <Tag color="blue">{ratioData?.humanPercentile[50].toFixed(4)}</Tag>
          </Descriptions.Item>
        </Descriptions>
        <Descriptions title="EColi(Avg:SD:CV:Percentile50)" column={1}>
          <Descriptions.Item label="Stat">
            <Tag color="blue">{ratioData?.ecoliAvg.toFixed(4)}</Tag>
            <Tag color="blue">{ratioData?.ecoliCV.toFixed(4)}</Tag>
            <Tag color="blue">{ratioData?.ecoliSD.toFixed(4)}</Tag>
            <Tag color="blue">{ratioData?.ecoliPercentile[50].toFixed(4)}</Tag>
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
