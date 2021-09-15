import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Col, Descriptions, Row, Tag } from 'antd';

export type QtChartsProps = {
  values: any;
};

const QtCharts: React.FC<QtChartsProps> = (props: any) => {
  const [handleOption, setHandleOption] = useState({});
  const [ratioData, setRatioData] = useState<any>();

  useEffect(() => {
    const op = async () => {
      const result = props.values.peptideRatioData;
      // const ecoliData: any[][] = [];
      const ecoliData = result.data.ecoli.map((data: { x: any; y: any }) => {
        return [data.x, data.y];
      });
      const humanData = result.data.human.map((data: { x: any; y: any }) => {
        return [data.x, data.y];
      });
      const yeastData = result.data.yeast.map((data: { x: any; y: any }) => {
        return [data.x, data.y];
      });
      setRatioData(result.data);
      const option = {
        xAxis: {
          splitLine: {
            show: false,
          },
          scale: true,
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
        },
        yAxis: {
          splitLine: {
            show: false,
          },
          scale: true,
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
        },
        animation: false,
        toolbox: {
          feature: {
            restore: {},
            dataView: {},
            saveAsImage: {},
          },
        },
        dataZoom: { type: 'inside' },
        tooltip: {
          trigger: 'axis',
          textStyle: {
            color: '#000',
            fontSize: '14',
            fontWeight: 'normal',
            fontFamily: 'Times New Roman,STSong',
          },
        },
        legend: {
          right: '8%',
          align: 'left',
          textStyle: {
            fontSize: '14',
            fontFamily: 'Times New Roman,STSong',
          },
        },
        series: [
          {
            type: 'scatter',
            name: 'ecoli',
            symbolSize: 7,
            color: 'tomato',
            data: ecoliData,
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
              tooltip: {
                // formatter: formula,
                axisPointer: {
                  label: {
                    fontFamily: 'Times New Roman,STSong',
                  },
                },
              },
              label: { show: false },
              data: [{ yAxis: result.data.ecoliAvg, name: '平均线' }],
            },
          },
          {
            type: 'scatter',
            name: 'human',
            symbolSize: 7,
            color: '#60B077',
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
              tooltip: {
                // formatter: formula,
                axisPointer: {
                  label: {
                    fontFamily: 'Times New Roman,STSong',
                  },
                },
              },
              label: { show: false },
              data: [{ yAxis: result.data.humanAvg, name: '平均线' }],
            },
          },
          {
            type: 'scatter',
            name: 'yeast',
            symbolSize: 7,
            color: '#1890ff',
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
              tooltip: {
                // formatter: formula,
                axisPointer: {
                  label: {
                    fontFamily: 'Times New Roman,STSong',
                  },
                },
              },
              label: { show: false },
              data: [{ yAxis: result.data.yeastAvg, name: '平均线' }],
            },
          },
        ],
      };
      setHandleOption(option);
    };
    op();
  }, []);

  return (
    <Row>
      <Col span="3">
        <Descriptions title="鉴定数" column={1}>
          <Descriptions.Item label="A组">
            <Tag color="blue">{ratioData?.identifyNumA}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="B组">
            <Tag color="blue">{ratioData?.identifyNumB}</Tag>
          </Descriptions.Item>
        </Descriptions>
        <Descriptions title="yeast" column={1}>
          <Descriptions.Item label="yeastAvg">
            <Tag color="blue">{ratioData?.yeastAvg.toFixed(4)}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="yeastCV">
            <Tag color="blue">{ratioData?.yeastCV.toFixed(4)}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="yeastSD">
            <Tag color="blue">{ratioData?.yeastSD.toFixed(4)}</Tag>
          </Descriptions.Item>
        </Descriptions>
        <Descriptions title="human" column={1}>
          <Descriptions.Item label="humanAvg">
            <Tag color="blue">{ratioData?.humanAvg.toFixed(4)}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="humanCV">
            <Tag color="blue">{ratioData?.humanCV.toFixed(4)}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="humanSD">
            <Tag color="blue">{ratioData?.humanSD.toFixed(4)}</Tag>
          </Descriptions.Item>
         
        </Descriptions>
        <Descriptions title="ecoli" column={1}>
          <Descriptions.Item label="ecoliAvg">
            <Tag color="blue">{ratioData?.ecoliAvg.toFixed(4)}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="ecoliCV">
            <Tag color="blue">{ratioData?.ecoliCV.toFixed(4)}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="ecoliSD">
            <Tag color="blue">{ratioData?.ecoliSD.toFixed(4)}</Tag>
          </Descriptions.Item>
        </Descriptions>
      </Col>
      <Col span="21">
        <ReactECharts
          option={handleOption}
          style={{ width: `100%`, height: '700px' }}
          lazyUpdate={true}
        />
      </Col>
    </Row>
  );
};

export default QtCharts;
